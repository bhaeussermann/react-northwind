import React, { Component } from 'react';
import './Employees.css';
import Common from './Common.js';

class EmployeeRow extends Component {
  state = {
    isBusy: false,
    errorMessage: null
  };

  constructor(props) {
    super(props);
    this.state.employee = props.employee;
    this.state.loadEmployees = props.loadEmployees;
  }

  async confirmDelete() {
    if (window.confirm(`Delete ${this.state.employee.firstName} ${this.state.employee.lastName}?`)) {
      try {
        this.setState({ isBusy: true, errorMessage: null });
        await Common.resolveResponse(fetch('/employees/' + this.state.employee.id, { method: 'delete' }));
      }
      catch (error) {
        this.setState({ errorMessage: 'Error deleting employee: ' + error.message });
        throw error;
      }
      finally {
        this.setState({ isBusy: false });
      }

      await this.state.loadEmployees();
    }
  }

  render() {
    return (
      <tr>
        <td>{this.state.employee.lastName}</td>
        <td>{this.state.employee.firstName}</td>
        <td>{this.state.employee.title}</td>
        <td>
          <button className="btn btn-link" onClick={() => window.location = '/employees/edit/' + this.state.employee.id}>Edit</button>
        </td>
        <td>
          <button className="btn btn-link" onClick={() => this.confirmDelete()}>Delete</button>
          {this.state.isBusy && (<Common.Spinner inline={true} />)}
          {this.state.errorMessage && 
            (<span className="icon-tooltip fa fa-lg fa-exclamation-circle">
              <span className="icon-tooltip-text">{this.state.errorMessage}</span>
            </span>)}
        </td>
      </tr>
    );
  }
}


const SortDirection = Object.freeze({ up: 0, down: 1});

class Employees extends Component {
  state = {
    isBusy: true,
    errorMessage: null,
    sortedColumn: 'lastName',
    sortDirection: SortDirection.up,
    employees: null,
    filteredEmployees: null
  };

  componentDidMount() {
    this.loadEmployees();
  };

  async loadEmployees() {
    this.setState({ isBusy: true, errorMessage: null });
    const controller = new AbortController();
    try {
      const employees = 
        await Common.timeout(
          Common.parseResponseAsJson(
            fetch('/employees', { signal: controller.signal })
          ), 5000);
      this.setState({ isBusy: false, employees, filteredEmployees: employees });
    }
    catch (error) {
        controller.abort();
        this.setState({ isBusy: false, errorMessage: 'Error retrieving employees: ' + error.message });
        throw error;
    }
  }

  getColumnClasses(column)
  {
    var classes = 'sortable';
    if (column === this.state.sortedColumn) {
      classes += ' sort-arrow';
      classes += this.state.sortDirection === SortDirection.up ? ' up' : ' down';
    }
    return classes;
  }

  toggleSortedColumn(column) {
    if (column === this.state.sortedColumn) {
      this.setState({ sortDirection: this.state.sortDirection === SortDirection.up ? SortDirection.down : SortDirection.up });
    }
    else {
      this.setState({ sortedColumn: column, sortDirection: SortDirection.up });
    }
  }

  getSortedEmployees() {
    return this.state.filteredEmployees.sort((a, b) => {
      const aValue = a[this.state.sortedColumn], bValue = b[this.state.sortedColumn];
      if (aValue === bValue)
        return 0;
      if (this.state.sortDirection === SortDirection.up)
        return aValue < bValue ? -1 : 1;
      return aValue < bValue ? 1 : -1;
    });
  }

  searchFilterChanged(event) {
    const searchFilter = event.target.value.toLowerCase();
    const filteredEmployees = !searchFilter.length
      ? this.state.employees
      : this.state.employees.filter(e => 
        e.firstName.toLowerCase().indexOf(searchFilter) !== -1
        || e.lastName.toLowerCase().indexOf(searchFilter) !== -1
        || e.title.toLowerCase().indexOf(searchFilter) !== -1);
    this.setState({ filteredEmployees: filteredEmployees });
  }
  
  render() {
    return (
      <div>
        <h1>Employees
          <input className="form-control search" placeholder="Search" type="text" onChange={e => this.searchFilterChanged(e)}></input>
        </h1>
        {this.state.isBusy && (<Common.Spinner />)}
        {this.state.errorMessage && (<h5>{this.state.errorMessage}</h5>)}
        {this.state.employees &&
          (
            <div>
              <button className="btn btn-primary" type="button" onClick={() => (window.location = '/employees/add')}>Add</button>
              <table className="table">
                <thead>
                  <tr>
                    <th className={this.getColumnClasses('lastName')} onClick={() => this.toggleSortedColumn('lastName')}>Last Name</th>
                    <th className={this.getColumnClasses('firstName')} onClick={() => this.toggleSortedColumn('firstName')}>First Name</th>
                    <th className={this.getColumnClasses('title')} onClick={() => this.toggleSortedColumn('title')}>Title</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.getSortedEmployees().map(e => (<EmployeeRow key={e.id} employee={e} loadEmployees={() => this.loadEmployees()} />))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    );
  }
}

export default Employees;
