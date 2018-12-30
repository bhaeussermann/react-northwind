import React, { Component } from 'react';
import './EditEmployee.css';
import Common from './Common.js';

const dateToString = date => `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;

class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = props.employee;
    this.employeeChanged = props.employeeChanged;
  }

  componentWillReceiveProps(props) {
    this.setState(props.employee);
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
                onChange={e => this.changeEmployee({ firstName: e.target.value })}
                value={this.state.firstName} />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="lastName">Last name:</label></td>
            <td>
              <input id="lastName" className="form-control" type="text" required
                onChange={e => this.changeEmployee({ lastName: e.target.value })}
                value={this.state.lastName} />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="title">Title:</label></td>
            <td>
              <input id="title" className="form-control" type="text" required
                onChange={e => this.changeEmployee({ title: e.target.value })}
                value={this.state.title} />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="birthDate">Birth Date:</label></td>
            <td>
              <input id="birthDate" className="form-control" type="date"
                onChange={e => this.changeEmployee({ birthDate: e.target.value })}
                value={dateToString(new Date(this.state.birthDate))} />
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
    isLoading: false,
    didLoad: false,
    isSaving: false,
    employee: {
      firstName: '',
      lastName: '',
      title: '',
      birthDate: ''
    }
  };

  constructor(props) {
    super();
    this.employeeId = props.match.params.id;
  }

  async componentDidMount() {
    if (this.employeeId) {
      this.setState({ isLoading: true, errorMessage: null });
      try {
        const employee = await Common.parseResponseAsJson(fetch('/northwind/employees/' + this.employeeId));
        this.setState({ employee, didLoad: true });
      }
      catch (error) {
        this.setState({ errorMessage: error.message });
      }
      finally {
        this.setState({ isLoading: false });
      }
    }
    else {
      this.setState({ didLoad: true });
    }
  }

  async save(event) {
    event.preventDefault();

    this.setState({ isSaving: true, errorMessage: null });

    try {
      var saveCall = this.employeeId
        ? fetch('/northwind/employees/' + this.employeeId, {
            method: 'put',
            body: JSON.stringify(this.state.employee)
          })
        : fetch('/northwind/employees', { 
            method: 'post',
            body: JSON.stringify(this.state.employee)
          });

      await Common.resolveResponse(saveCall);
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
        <h1>{this.employeeId ? 'Edit Employee' : 'Add Employee'}</h1>
        {this.state.isLoading && (<Common.Spinner />)}
        {this.state.errorMessage && (<h5>{this.state.errorMessage}</h5>)}
        <form onSubmit={e => this.save(e)}>
          {this.state.didLoad && (<Employee employee={this.state.employee} employeeChanged={e => this.setState({ employee: e })} />)}
          <button className="btn btn-primary" type="submit" disabled={!this.state.didLoad || this.state.isSaving}>Save</button>
          {this.state.isSaving && (<Common.Spinner inline />)}
          <button className="btn btn-secondary" type="button" disabled={this.state.isSaving} onClick={() => window.location = '/employees'}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default EditEmployee;
