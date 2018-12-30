import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Employees from './Employees.js';
import EditEmployee from './EditEmployee.js';

class App extends Component {
  render() {
    return (
    <BrowserRouter>
      <Switch>
        <Route path={['/', '/employees']} exact={true} component={Employees} />
        <Route path="/employees/add" component={EditEmployee} />
        <Route path="/" render={props => (<h5>Path not found: {props.location.pathname}</h5>)} />
      </Switch>
    </BrowserRouter>
    );
  }
}

export default App;
