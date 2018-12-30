import React, { Component } from 'react';
import './EditEmployee.css';
import Common from './Common.js';

class Employee extends Component {
  constructor(props) {
    super();
    this.state = props.employee;
    this.employeeChanged = props.employeeChanged;
  }

  changeEmployee(changes) {
    this.setState(changes, () => this.employeeChanged(this.state));
  }

  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td><label htmlFor="firstName">First name:</label></td>
            <td>
              <input id="firstName" className="form-control" type="text" autoFocus required
                onChange={e => this.changeEmployee({ firstName: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="lastName">Last name:</label></td>
            <td>
              <input id="lastName" className="form-control" type="text" required
                onChange={e => this.changeEmployee({ lastName: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="title">Title:</label></td>
            <td>
              <input id="title" className="form-control" type="text" required
                onChange={e => this.changeEmployee({ title: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="birthDate">Birth Date:</label></td>
            <td>
              <input id="birthDate" className="form-control" type="date"
                onChange={e => this.changeEmployee({ birthDate: e.target.value })} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

class EditEmployee extends Component {
  state = {
    errorMessage: null,
    isSaving: false,
    employee: {
      firstName: '',
      lastName: '',
      title: '',
      birthDate: ''
    }
  };

  async save(event) {
    event.preventDefault();

    this.setState({ isSaving: true, errorMessage: null });

    try {
      await Common.resolveResponse(fetch('/northwind/employees', { 
        method: 'post',
        body: JSON.stringify(this.state.employee)
      }));
    }
    catch (error) {
      this.setState({ isSaving: false, errorMessage: 'Error saving employee: ' + error.message });
      throw error;
    }

    window.location = '/employees';
  }

  render() {
    return (
      <div>
        <h1>Add Employee</h1>
        {this.state.errorMessage && (<h5>{this.state.errorMessage}</h5>)}
        <form onSubmit={e => this.save(e)}>
          <Employee employee={this.state.employee} employeeChanged={e => this.setState({ employee: e })} />
          <button className="btn btn-primary" type="submit" disabled={this.state.isSaving}>Save</button>
          {this.state.isSaving && (<Common.Spinner inline />)}
          <button className="btn btn-secondary" type="button" disabled={this.state.isSaving} onClick={() => window.location = '/employees'}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default EditEmployee;
