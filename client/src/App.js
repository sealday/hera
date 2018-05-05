import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import { Notification, CurrentStore, MenuList } from './components'
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button'
import { MenuItem } from 'material-ui/Menu'
import Popover from 'material-ui/Popover';
import short_id from 'shortid'
import { push, goBack } from 'react-router-redux'
import { ajax, theme } from './utils'
import { selectStore } from './actions'



const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
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
    menuOpen: false,
    menuAnchorEl: null,
  }

  handleMenu = e => {
    const target = e.currentTarget
    this.setState(prev => ({
      menuOpen: !prev.menuOpen,
      menuAnchorEl: target,
    }))
  }

  handleMenuClose = () => {
    this.setState(() => ({
      menuOpen: false,
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
      location.href = "login.html";
    });
  }

  isCurrentStorePermit () {
    const { store, user } = this.props
    if (user.role === '项目部管理员' || user.role === '基地仓库管理员') {
      const perms = user.perms || [];
      const projects = perms.filter((p) => p.insert).map((p) => p.projectId);
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
    classes: React.PropTypes.object.isRequired,
  }

  render() {
    const { classes, store, num, user, onlineUsers, children, system, dispatch } = this.props
    return (
      <div className="App" onClick={(e) => {
        global.socket.emit('client:click', {
          base: e.target.baseURI,
          text: e.target.textContent,
          tag: e.target.tagName,
          username: system.user.username,
        })
      }}>
        <Notification/>
        {this.isStoreSelected() && (
          <div className={classes.root}>
            <AppBar position="absolute" className={classes.appBar}>
              <Toolbar>
                <Typography variant="display3" color="inherit" noWrap className={classes.marginRight}>
                  赫拉管理系统
                </Typography>
                <Typography variant="headline" color="inherit" noWrap className={classes.marginRight}>
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
                  onClick={this.handleMenu}
                >当前在线人数{num}</Button>
                <Popover
                  open={this.state.menuOpen}
                  anchorEl={this.state.menuAnchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  onClose={this.handleMenuClose}
                >
                  <List>
                    {onlineUsers.map(user => <MenuItem
                      key={short_id.generate()}
                      onClick={this.handleMenuClose}
                    >{user.profile.name}</MenuItem>)}
                  </List>
                </Popover>
                <Button color="inherit" onClick={this.logout}>登出</Button>
                <Button color="inherit" onClick={() => dispatch(push('/profile'))}>{user.username}</Button>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.toolbar} />
              <MenuList user={user}/>
            </Drawer>
            <main className={classes.content}>
              <div className={classes.toolbar} />
              {children}
            </main>
          </div>
        )}
        {!this.isStoreSelected() && (
          <CurrentStore/>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    nav: state.nav,
    system: state.system,
    num: state.system.online,
    onlineUsers: state.system.onlineUsers,
    store: state.system.store,
    user: state.system.user,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(App));
