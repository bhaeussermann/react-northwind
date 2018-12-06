import React, { Component } from 'react';
import './App.css';
import Spinner from './Common.js';

class App extends Component {
  state = {
    loading: true,
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

  render() {
    return (
      <div>
        <h1>Employees</h1>
        {this.state.loading 
          ? (<Spinner />) 
          : (
            <table class="table">
              <tr>
                <th class="sortable">Last Name</th>
                <th class="sortable">FirstName</th>
                <th class="sortable">Title</th>
                <th></th>
              </tr>
              {this.state.employees.map(e => (
                <tr>
                  <td>{e.lastName}</td>
                  <td>{e.firstName}</td>
                  <td>{e.title}</td>
                </tr>
              ))}
            </table>
          )
        }
      </div>
    );
  }
}

export default App;
