import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FileManager from './modules/FileManager';
import Home from './modules/Home';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css'
import './index.css';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="file_manager" component={FileManager}/>
    </Route>
  </Router>
  ), document.getElementById('root')
);
