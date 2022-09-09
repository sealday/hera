import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import {
  CircularProgress,
  Typography,
} from '@material-ui/core'
import { Layout, Button, Dropdown, Menu } from 'antd'

import short_id from 'shortid'
import { get } from 'lodash'

import { CurrentStore, Loading, MenuList, withRouter } from '../components'
import { ajax, wrapper } from '../utils'
import { selectStore } from '../actions'
import './App.css'
import { UserOutlined } from '@ant-design/icons'


const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    minHeight: '100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  flex: {
    flex: 1,
  },
  marginRight: {
    marginRight: '1em',
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    margin: theme.spacing.unit * 2,
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

class App extends Component {
  state = {
    menuOpen: {
      printCompany: false,
      onlineCount: false,
    },
    menuAnchorEl: {
      printCompany: null,
      onlineCount: null,
    },
  }

  handleMenu = type => e => {
    const target = e.currentTarget
    this.setState(prev => ({
      menuOpen: { ...prev.menuOpen, [type]: !prev.menuOpen[type]},
      menuAnchorEl: { ...prev.menuAnchorEl, [type]: target},
    }))
  }

  handleMenuClose = type => () => {
    this.setState(prev => ({
      menuOpen: { ...prev.menuOpen, [type]: false },
    }))
  }

  isStoreSelected() {
    return this.props.system.store
  }

  logout = () => {
    // 清理客户端保存的 key
    localStorage.removeItem('X-Hera-Token')
    ajax('/api/logout', {
      method: 'POST'
    }).then(() => {
      this.props.navigate('/login')
    })
  }

  isCurrentStorePermit () {
    const { store, user } = this.props
    if (user.role === '项目部管理员' || user.role === '基地仓库管理员') {
      const perms = user.perms || [];
      const projects = perms.filter((p) => p.query).map((p) => p.projectId);
      return projects.indexOf(store._id) !== -1;
    } else {
      return true;
    }
  }

  componentWillUnmount() {
    const { onLeave } = this.props
    onLeave()
  }

  componentDidMount() {
    const { dispatch, config, onEnter } = this.props
    onEnter()
    if (!this.isCurrentStorePermit()) {
      dispatch(selectStore(config, false))
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { config, classes, store, user, onlineUsers, dispatch, loading } = this.props

    if (loading) {
      return (
        <Loading />
      )
    }
                    
    const menu = (
      <Menu
        items={onlineUsers.map(user => ({
          key: short_id.generate(),
          label: get(user, ['profile', 'name'], '异常用户'),
        }))}
      />
    )
    return (
      <Layout className='App'>
        <Layout.Header className='header'>
          <h5 className='title'>{config.systemName}</h5>
          <p style={{ marginLeft: '2em', float: 'left', color: '#fff' }}>{store && store.company + store.name}</p>
          <Button style={{ color: '#fff' }} onClick={() => { dispatch(selectStore(false)) }} type='text'>选择仓库</Button>
          <div style={{ float: 'right' }}>
            <Dropdown overlay={menu}>
              <Button style={{ color: '#fff' }} type='text'>当前在线 {onlineUsers.length} 人</Button>
            </Dropdown>
            <Button style={{ color: '#fff' }} type='text' onClick={this.logout}>退出</Button>
            <Button 
              onClick={() => this.props.navigate('/profile')}
              icon={<UserOutlined />} style={{ color: '#fff' }} type='text'>{user.username}</Button>
          </div>
        </Layout.Header>
        <Layout>
          <Layout.Sider width={240} className='sider'>
            <MenuList user={user} store={store} />
          </Layout.Sider>
          <Layout className='content'>
            {this.isStoreSelected() && <Outlet />}
            {!this.isStoreSelected() && <CurrentStore />}
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  system: state.system,
  onlineUsers: state.core.onlineUsers,
  store: state.system.store,
  user: state.system.user,
  config: state.system.config,
  loading: state.system.loading,
})

export default wrapper([
  withRouter,
  withStyles(styles),
  connect(mapStateToProps),
  App,
])