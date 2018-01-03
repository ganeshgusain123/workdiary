import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import TableRow from './TableRow';
import CommonDialog from './CommonOverlay';
import DialogBox from './Overlay';
import MultiSelectField from './Multiselect';
import * as actions from '../Actions';

class Projects extends Component {
	 constructor(props) {
       super(props);
       this.state = {
       		value: '',
       		projects: '',
       		show: false, 
       		showDelete: false,
       		projectId: null, 
       		alreadyAssociated: {}
		};

		this.mapUsersForSelect = this.mapUsersForSelect.bind(this);
		this.handleShowTeam = this.handleShowTeam.bind(this);
		this.handleShowDelete = this.handleShowDelete.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.resetDialogState = this.resetDialogState.bind(this);
		this.onPageChange = this.onPageChange.bind(this);
     }
     /* Send AJAX to fetch all Projects along with their users, and show the associated users
        as selected & others available for select.....     
     */
     componentDidMount(){
// 		console.log(nextProps);
     	this.initializeComponent(this.props);
     }

	/* 
	 refer : https://stackoverflow.com/a/38916204/1331003
	 */
	componentWillReceiveProps(nextProps){
//      	console.log("project PROPS RECEIVED");
// 		console.log(nextProps);
		// only proceed if change in realod property.....
		if (this.props.reload != nextProps.reload) {
	     	this.initializeComponent(nextProps);
	    }
	}
	
	// Fetch data from server if required .......
	initializeComponent(props) {
     	if (props.reload) {
	     	console.log("INIT  Component");

     		var that = this;
		   axios.get('/project')
		   .then(response => {
			// dispatch action to list projects, pass response data......
			props.showProjects({ projects: response.data.projects, 
				 users: response.data.users});
// 				 users: that.mapUsersForSelect(response.data.users)});
		   })
		   .catch(function (error) {
			 console.log(error);
		   })
			// also reset all dialogs to Close state......i.e. close all dialogs
			this.resetDialogState();
       }
	}

	/* user array  should contain objects {value, label}  */
	 mapUsersForSelect(data) {
	 	var result = [];
	 	
	 	for (var index in data) {
	 		var tmpObj = data[index];
	 		result.push({value: tmpObj["id"], label:tmpObj["email"]});
	 	}
	 	return result;
	 }

	// This method displays update team dialog.....
     handleShowTeam(projectId){
     	var newstate = Object.assign(this.state);
     	
		// also map project associated selected users for dialog to display already selected.....
		var alreadyAssociated = {};
		for (var index in this.props.projects) {
			var tmpPro = this.props.projects[index];

			if (projectId == tmpPro.id) {
				for (var index2 in tmpPro.users) {
					alreadyAssociated[tmpPro.users[index2].id] = true;
				}
			}
		}
     	newstate.show = true;
     	newstate.projectId = projectId;
     	newstate.alreadyAssociated = alreadyAssociated;
		
     	this.setState(newstate);
     }

	// This method update state to display Delete dialog....
     handleShowDelete(projectId){
     	var newstate = Object.assign(this.state);
     	
     	newstate.showDelete = true;
     	newstate.projectId = projectId;
		
     	this.setState(newstate);
     }

	// This method sends Delete Url request to server.....
	 handleDelete() {
	 	var that = this;
		let uri = `/project/${this.state.projectId}`;
		axios.delete(uri)
	   .then(response => {
			// dispatch action to reload list projects....
			that.props.updateProjectList(true, true);
	   })
	   .catch(function (error) {
		 console.log(error);
	   })
		
		// also reset all dialogs to Close state......
		this.resetDialogState();
	 }

	// This method sends Delete Url request to server.....
	 resetDialogState() {
     	var newstate = Object.assign(this.state);
     	
     	newstate.showDelete = false;
     	newstate.show = false;
		
     	this.setState(newstate);
	 }

     tabRow(){
       if(this.props.projects instanceof Array){
       	var that = this;
         return this.props.projects.map(function(object, i){
             return <TableRow obj={object} key={i}
             	 handler={that.handleShowTeam} delhandler={that.handleShowDelete}/>;
         })
       }
     }

  onPageChange(e) {
  	var newPage = e.target.dataset.page;
	console.log(newPage);  
	// dispatch an action from here .....which will update the state of the app....
	
	if (newPage == "add-project")
		this.props.changeMainPage(newPage)
  }

  render(){
    return (
      <div>
        <h1>Projects</h1>

        <div className="row">
          <div className="col-md-10"></div>
          <div className="col-md-2">
            <a data-page="add-project" onClick={this.onPageChange}>Create the Project</a>
          </div>
        </div><br/>
        <table className="table table-hover">
            <thead>
				<tr>
					<td>ID</td>
					<td>Name</td>
					<td>Description</td>
					<td>Actions</td>
				</tr>
            </thead>
            <tbody>
              {this.tabRow()}
            </tbody>
        </table>
    	<DialogBox show={this.state.show} title="Update Project Team" projectId={this.state.projectId}
    	 	alreadyAssociated={this.state.alreadyAssociated} users={
    	 		this.mapUsersForSelect(this.props.users)}
    	 	resetDialogState={this.resetDialogState}/>
    	<CommonDialog show={this.state.showDelete} title="Delete Project"
    		body="Are you sure want to Delete this Project! " projectId={this.state.projectId}
    	 	oktitle="Delete" handleOK={this.handleDelete} handleCancel={this.resetDialogState}/>
    </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    page: state.mainpage_reducer.page,
    reload: state.project_reducer.reload,
    projects: state.project_reducer.projects,
    users: state.project_reducer.users
  }
}

export default connect(mapStateToProps, actions)(Projects);