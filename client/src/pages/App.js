import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Button,
  CircularProgress,
  Drawer,
  List,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from '@material-ui/core'

import short_id from 'shortid'
import { push } from 'react-router-redux'
import { Helmet } from "react-helmet"
import { get } from 'lodash'

import { Notification, CurrentStore, MenuList } from '../components'
import { ajax, wrapper } from '../utils'
import { selectStore, selectPrintCompany } from '../actions'
import './App.css'


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
      this.props.router.push('/login')
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

  componentDidMount() {
    const { dispatch, config } = this.props
    if (!this.isCurrentStorePermit()) {
      dispatch(selectStore(config, false))
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { config, classes, store, user, onlineUsers, children, dispatch, loading } = this.props

    if (loading) {
      return (
        <main className={classes.main}>
          <div className={classes.paper}>
            <CircularProgress className={classes.progress} />
            <Typography>加载中</Typography>
          </div>
        </main>
      )
    }
    return (
      <div className="App">
        <Notification/>
        <Helmet>
          <title>{config.systemName}</title>
        </Helmet>
        <div className={classes.root}>
          <AppBar position="absolute" className={classes.appBar + " hidden-print"}>
            <Toolbar>
              <Typography variant="h5" color="inherit" noWrap className={classes.marginRight}>
                {config.systemName}
              </Typography>
              <Typography variant="subtitle1" color="inherit" noWrap className={classes.marginRight}>
                {store && store.company + store.name}
              </Typography>
              <Button
                color="inherit"
                onClick={e => {
                  e.preventDefault()
                  dispatch(selectStore(false))
                }}
              >选择仓库</Button>
              <span className={classes.flex} />
              <Button
                color="inherit"
                onClick={this.handleMenu('onlineCount')}
              >当前在线 {onlineUsers.length} 人</Button>
              <Popover
                open={this.state.menuOpen['onlineCount']}
                anchorEl={this.state.menuAnchorEl['onlineCount']}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                onClose={this.handleMenuClose('onlineCount')}
              >
                <List>
                  {onlineUsers.map(user => <MenuItem
                    key={short_id.generate()}
                    onClick={this.handleMenuClose('onlineCount')}
                  >{get(user, ['profile', 'name'], '异常用户')}</MenuItem>)}
                </List>
              </Popover>
              <Button color="inherit" onClick={this.logout}>退出</Button>
              <Button color="inherit" onClick={() => dispatch(push('/profile'))}>{user.username}</Button>
            </Toolbar>
          </AppBar>
          {this.isStoreSelected() && <Drawer
            variant="permanent"
            className="hidden-print"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
            <MenuList user={user} store={store}/>
          </Drawer>}
          <main className={classes.content + " reset-to-print"}>
            <div className={classes.toolbar + " hidden-print"} />
            {this.isStoreSelected() && children}
            {!this.isStoreSelected() && <CurrentStore/>}
          </main>
        </div>
      </div>
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
  withStyles(styles),
  connect(mapStateToProps),
  App,
])

