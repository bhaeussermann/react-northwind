import React, { Component } from 'react';
import './Employees.css';
import Common from './Common.js';

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
    this.setState({ isBusy: true, errorMessage: null, employees: null });
    const controller = new AbortController();
    try {
      const response = await Common.timeout(fetch('/northwind/employees', { signal: controller.signal }), 5000);
      const employees = await response.json();
      this.setState({ isBusy: false, employees: employees, filteredEmployees: employees });
    }
    catch (error) {
        controller.abort();
        console.error(error);
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

  async confirmDelete(employee) {
    if (window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        this.setState({ isBusy: true, errorMessage: null });
        await fetch('/northwind/employees/' + employee.id, { method: 'delete' });
      }
      catch (error) {
        console.error(error);
        this.setState({ isBusy: false, errorMessage: 'Error deleting employee: ' + error.message });
        throw error;
      }

      await this.loadEmployees();
    }
  }
  
  render() {
    return (
      <div>
        <h1>Employees
          <input className="form-control search" placeholder="Search" type="text" onChange={e => this.searchFilterChanged(e)}></input>
        </h1>
        {this.state.isBusy ? (<Common.Spinner />) : ''}
        {this.state.errorMessage ? (<h5>{this.state.errorMessage}</h5>) : ''}
        {!this.state.employees ? ''
          : (
            <table className="table">
              <thead>
                <tr>
                  <th className={this.getColumnClasses('lastName')} onClick={() => this.toggleSortedColumn('lastName')}>Last Name</th>
                  <th className={this.getColumnClasses('firstName')} onClick={() => this.toggleSortedColumn('firstName')}>First Name</th>
                  <th className={this.getColumnClasses('title')} onClick={() => this.toggleSortedColumn('title')}>Title</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.getSortedEmployees().map(e => (
                  <tr key={e.id}>
                    <td>{e.lastName}</td>
                    <td>{e.firstName}</td>
                    <td>{e.title}</td>
                    <td><button className="btn btn-link" onClick={() => this.confirmDelete(e)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    );
  }
}

export default Employees;
