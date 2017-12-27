import React, {Component} from 'react';
import {browserHistory} from 'react-router';

class CreateUser extends Component {
  constructor(props){
    super(props);
    this.state = {name: '', email: ''};

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange1(e){
    this.setState({
      name: e.target.value
    })
  }
  handleChange2(e){
    this.setState({
      email: e.target.value
    })
  }
  handleSubmit(e){
    e.preventDefault();
    const data = {
      name: this.state.name,
      email: this.state.email
    }
    let uri = '/user';
    axios.post(uri, data).then((response) => {
      browserHistory.push('/users');
    });
  }

    render() {
      return (
      <div>
        <h1>Create A User</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Name:</label>
                <input type="text" className="form-control" onChange={this.handleChange1} />
              </div>
            </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Email:</label>
                  <input type="email" className="form-control col-md-6" onChange={this.handleChange2} />
                </div>
              </div>
            </div><br />
            <div className="form-group">
              <button className="btn btn-primary">Add User</button>
            </div>
        </form>
  </div>
      )
    }
}
export default CreateUser;