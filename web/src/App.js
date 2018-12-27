import React, { Component } from 'react';
import './App.css';
import Spinner from './Common.js';

const SortDirection = Object.freeze({ up: 0, down: 1});

class App extends Component {

  state = {
    loading: true,
    sortedColumn: 'lastName',
    sortDirection: SortDirection.up,
    employees: []
  };

  constructor() {
    super();
    const self = this;
    document.addEventListener('DOMContentLoaded', function() {
      fetch('/northwind/employees')
      .then(response => response.json())
      .then(employees => self.setState({ loading: false, employees: employees }))
      .catch(error => console.error(error));
    }, false);
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
    return this.state.employees.sort((a, b) => {
      const aValue = a[this.state.sortedColumn], bValue = b[this.state.sortedColumn];
      if (aValue === bValue)
        return 0;
      if (this.state.sortDirection === SortDirection.up)
        return aValue < bValue ? -1 : 1;
      return aValue < bValue ? 1 : -1;
    });
  }
  
  render() {
    return (
      <div>
        <h1>Employees</h1>
        {this.state.loading 
          ? (<Spinner />) 
          : (
            <table className="table">
              <thead>
                <tr>
                  <th className={this.getColumnClasses('lastName')} onClick={() => this.toggleSortedColumn('lastName')}>Last Name</th>
                  <th className={this.getColumnClasses('firstName')} onClick={() => this.toggleSortedColumn('firstName')}>FirstName</th>
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

export default App;
