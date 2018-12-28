import React, { Component } from 'react';
import './Employees.css';
import Common from './Common.js';

const SortDirection = Object.freeze({ up: 0, down: 1});

class Employees extends Component {
  state = {
    loading: true,
    loadingError: null,
    sortedColumn: 'lastName',
    sortDirection: SortDirection.up,
    employees: []
  };

  componentDidMount() {
    const controller = new AbortController();
    Common.timeout(fetch('/northwind/employees', { signal: controller.signal }), 5000)
      .then(response => response.json())
      .then(employees => this.setState({ loading: false, employees: employees }))
      .catch(error => {
        controller.abort();
        console.error(error);
        this.setState({ loading: false, loadingError: error });
      });
  };

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
        <h1>Employees
          <input className="form-control search" placeholder="Search" type="text"></input>
        </h1>
        {this.state.loading 
          ? (<Common.Spinner />) 
          : this.state.loadingError
            ? (<h5>Error retrieving employees: {this.state.loadingError.message}</h5>)
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

export default Employees;
