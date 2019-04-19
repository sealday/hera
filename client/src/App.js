import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Button,
  Drawer,
  List,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from '@material-ui/core'
import short_id from 'shortid'
import { push } from 'react-router-redux'

import { Notification, CurrentStore, MenuList } from './components'
import { ajax, wrapper } from './utils'
import { selectStore, selectPrintCompany } from './actions'
import config from './config'
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
    // TODO 这里出错？？？ 总是重定向到首页
    ajax('/api/logout', {
      method: 'POST'
    }).then(res => {
    }).catch(err => {
    }).then(() => {
      window.location.href = "login.html";
    });
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
    const { dispatch } = this.props
    if (!this.isCurrentStorePermit()) {
      dispatch(selectStore(false))
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes, store, num, user, onlineUsers, children, dispatch } = this.props
    return (
      <div className="App">
        <Notification/>
        <div className={classes.root}>
          <AppBar position="absolute" className={classes.appBar + " hidden-print"}>
            <Toolbar>
              <Typography variant="headline" color="inherit" noWrap className={classes.marginRight}>
                {config.name}
              </Typography>
              <Typography variant="subheading" color="inherit" noWrap className={classes.marginRight}>
                {store && store.company + store.name}
              </Typography>
              <Button
                color="inherit"
                onClick={e => {
                  e.preventDefault()
                  dispatch(selectStore(false))
                }}
              >其他仓库</Button>
              <span className={classes.flex} />
              <Button
                color="inherit"
                onClick={this.handleMenu('printCompany')}
              >切换公司（打印）</Button>
              <Popover
                open={this.state.menuOpen['printCompany']}
                anchorEl={this.state.menuAnchorEl['printCompany']}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                onClose={this.handleMenuClose('printCompany')}
              >
                <List>
                  {['上海创兴建筑设备租赁有限公司', '上海标济建材有限公司'].map(name => <MenuItem
                    key={short_id.generate()}
                    onClick={(e) => {
                      this.setState({
                        showSwitchList: false
                      })
                      this.props.dispatch(selectPrintCompany(name))
                      this.handleMenuClose('printCompany')(e)
                    }}
                  >{name}</MenuItem>)}
                </List>
              </Popover>
              <Button
                color="inherit"
                onClick={this.handleMenu('onlineCount')}
              >当前在线 {num} 人</Button>
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
                  >{user.profile.name}</MenuItem>)}
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
  num: state.system.online,
  onlineUsers: state.system.onlineUsers,
  store: state.system.store,
  user: state.system.user,
})

export default wrapper([
  withStyles(styles),
  connect(mapStateToProps),
  App,
])

