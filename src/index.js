import 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FileManager from './modules/FileManager';
import Profile from './modules/Profile';
import Home from './modules/Home';
import Article from './modules/Article';
import Purchase from './store/Purchase';
import TransferIn from './store/TransferIn';
import TransferOut from './store/TransferOut';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css';
import 'react-tagsinput/react-tagsinput.css';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import { ajax } from './utils';

// 在显示之前，先确定当前的用户已经登录！
ajax('/api/is_login').then(() => {
  ReactDOM.render((
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="file_manager" component={FileManager}/>
          <Route path="profile" component={Profile}/>
          <Route path="article" component={Article}/>
          <Route path="purchase" component={Purchase}/>
          <Route path="transfer_in" component={TransferIn}/>
          <Route path="transfer_out" component={TransferOut}/>
        </Route>
      </Router>
    ), document.getElementById('root')
  );
});
