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
import Operator from './people/Operator'
import OperatorCreate from './people/OperatorCreate'
import TransferOut from './store/TransferOut';
import Project from './project/Project';
import ProjectCreate from './project/ProjectCreate';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css';
import 'react-tagsinput/react-tagsinput.css';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import { ajax } from './utils';
import io from 'socket.io-client';
import { createStore } from 'redux';
import { Provider } from 'react-redux'


import moment from 'moment';

moment.locale('zh-CN');

const initialState = {
  projects: [],
  articles: [],
  num: 0,
  users: [],
};

const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_PROJECTS":
      const projects = action.projects;
      return {...state, projects};
    case "UPDATE_ARTICLES":
      const articles = action.articles;
      return {...state, articles};
    case 'UPDATE_NUM':
      const num  = action.num
      return {...state, num}
    case 'UPDATE_USERS':
      const users = action.users
      return {...state, users}
    default:
      return state;
  }
});

// 在显示之前，先确定当前的用户已经登录！
ajax('/api/is_login').then(() => {
  // 初始化数据
  ajax('/api/project').then(res => {
    const projects = res.data.projects
    store.dispatch({ type: "UPDATE_PROJECTS", projects });
  }).catch(res => {
    alert('出错了' + JSON.stringify(res));
  });

  ajax('/api/article').then(res => {
    const articles = res.data.articles
    store.dispatch({ type: 'UPDATE_ARTICLES', articles })
  }).catch(res => {
    alert('出错了' + JSON.stringify(res));
  });

  ajax('/api/user').then(res => {
    const users = res.data.users
    store.dispatch({ type: 'UPDATE_USERS', users })
  }).catch(res => {
    alert('出错了！' + JSON.stringify(res))
  })

  const socket = io();

  socket.on('server:num', num => {
    store.dispatch({ type: 'UPDATE_NUM',  num })
  });

  ReactDOM.render((
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="file_manager" component={FileManager}/>
          <Route path="operator" component={Operator}/>
          <Route path="operator_create" component={OperatorCreate}/>
          <Route path="project" component={Project}/>
          <Route path="project_create" component={ProjectCreate}/>
          <Route path="profile" component={Profile}/>
          <Route path="article" component={Article}/>
          <Route path="purchase" component={Purchase}/>
          <Route path="transfer_in" component={TransferIn}/>
          <Route path="transfer_out" component={TransferOut}/>
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('root')
  );
});
