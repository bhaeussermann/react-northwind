import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    employees: []
  };

  constructor() {
    super();
    const self = this;
    document.addEventListener('DOMContentLoaded', function() {
      fetch('/northwind/employees')
      .then(response => response.json())
      .then(employees => self.setState({ employees: employees }))
      .catch(error => console.error(error));
    }, false);
  }

  render() {
    return (
      <div>
        <h1>Employees</h1>
        <ul>{this.state.employees.map(e => (<li key={e.id}>{e.lastName}, {e.firstName}</li>))}</ul>
      </div>
    );
  }
}

export default App;
