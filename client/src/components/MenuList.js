import PropTypes from 'prop-types';
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import MenuItem from '@material-ui/core/MenuItem'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Dashboard from '@material-ui/icons/Dashboard'
import Work from '@material-ui/icons/Work'
import Storage from '@material-ui/icons/Storage'
import GroupWork from '@material-ui/icons/GroupWork'
import AccountBox from '@material-ui/icons/AccountBox'

import { isInsertable } from '../utils'


const allMenu = [
  {
    name: '仪表盘',
    path: '/dashboard',
    icon: Dashboard,
  },
  {
    name: '仓库操作',
    icon: Work,
    roles: ['项目部管理员', '系统管理员', '基地仓库管理员'],
    // TODO 解决这个权限特殊处理
    isInsertable: isInsertable,
    children: [
      {
        name: '采购入库',
        path: '/purchase/in/create',
        roles: ['系统管理员', '基地仓库管理员'],
      },
      {
        name: '销售出库',
        path: '/purchase/out/create',
        roles: ['系统管理员', '基地仓库管理员'],
      },
      {
        name: '调拨出库（发料）',
        path: '/transfer/out/create',
      },
      {
        name: '调拨入库（收料）',
        path: '/transfer/in/create',
      },
      {
        name: '盘点盈余入库',
        path: '/stocktaking/in/create',
        roles: ['系统管理员', '基地仓库管理员'],
      },
      {
        name: '盘点亏损出库',
        path: '/stocktaking/out/create',
        roles: ['系统管理员', '基地仓库管理员'],
      },
    ]
  },
  {
    name: '仓库查询',
    icon: Storage,
    children: [
      {
        name: '库存查询',
        path: '/store',
      },
      {
        name: '出入库查询',
        path: '/simple_search',
      },
      {
        name: '明细检索',
        path: '/search',
      },
      {
        name: '运输单查询',
        path: '/transport_table',
      },
    ]
  },
  {
    name: '公司',
    icon: GroupWork,
    roles: ['系统管理员', '财务管理员', '基地仓库管理员'],
    children: [
      {
        name: '租金计算',
        path: '/rent_calc',
      },
      {
        name: '出入库查询',
        path: '/simple_search_company',
      },
      {
        name: '运输单查询',
        path: '/transport_table_company',
      },
      {
        name: '合同',
        path: '/contract',
      },
    ]
  },
  {
    name: '系统信息',
    icon: AccountBox,
    roles: ['系统管理员'],
    children: [
      {
        name: '产品信息',
        path: '/product',
      },
      {
        name: '价格方案',
        path: '/price',
      },
      {
        name: '用户管理',
        path: '/operator',
      },
      {
        name: '项目列表',
        path: '/project',
      },
    ]
  },
];

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class MenuList extends React.Component {
  state = {
    open: { },
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  handleClick = (item) => {
    const { router } = this.context
    if (item.path) {
      router.push(item.path)
    }
    this.setState(prev => ({
      open: {
        [item.name]: !prev.open[item.name],
      }
    }));
  };

  componentDidMount() {
    const { router } = this.context
    allMenu.forEach(menuItem => {
      if (menuItem.children) {
        menuItem.children.forEach(subMenuItem => {
          if (router.isActive(subMenuItem.path)) {
            this.setState({
              open: {
                [menuItem.name]: true
              }
            })
          }
        })
      }
    })
  }

  getFilteredMenu = (menu) => {
    const { user, store } = this.props
    return menu.filter(menuItem => {
      if (menuItem.roles && menuItem.roles.indexOf(user.role) === -1) {
        return false
      } else {
        if (menuItem.isInsertable && !menuItem.isInsertable(store, user)) {
          return false;
        }
        if (menuItem.children) {
          menuItem.children = menuItem.children.filter(subMenuItem => !(subMenuItem.roles && subMenuItem.roles.indexOf(user.role) === -1))
        }
        return true
      }
    })
  }

  render() {
    const { classes } = this.props
    const { router } = this.context
    const menu = this.getFilteredMenu(allMenu)

    return (
      <div className={classes.root}>
        <List component="nav">
          {menu.map(menuItem =>
            (<div key={menuItem.name}>
              <MenuItem
                button
                onClick={() => this.handleClick(menuItem)}
                selected={!menuItem.children && router.isActive(menuItem.path)}
              >
                <ListItemIcon>
                  <menuItem.icon />
                </ListItemIcon>
                <ListItemText inset primary={menuItem.name}/>
                {menuItem.children && (this.state.open[menuItem.name] ? <ExpandLess /> : <ExpandMore />)}
              </MenuItem>
              {menuItem.children && (<Collapse in={this.state.open[menuItem.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menuItem.children.map(subMenuItem => (
                    <MenuItem
                      onClick={() => router.push(subMenuItem.path)}
                      button
                      key={subMenuItem.name}
                      className={classes.nested}
                      selected={router.isActive(subMenuItem.path)}
                    >
                      <ListItemText inset primary={subMenuItem.name} />
                    </MenuItem>
                  ))}
                </List>
              </Collapse>)}
            </div>))}
        </List>
      </div>
    );
  }
}

export default  withStyles(styles)(MenuList)