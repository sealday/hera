import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { matchPath, useNavigate } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import {
  List,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Collapse,
} from '@material-ui/core'
import {
  Dashboard,
  ExpandLess,
  ExpandMore,
  GroupWork,
  Search,
  Settings,
  Store,
} from '@material-ui/icons'

import { isInsertable } from '../utils'


const allMenu = [
  {
    name: '仪表盘',
    path: '/dashboard',
    icon: Dashboard,
  },
  {
    name: '仓库管理',
    icon: Store,
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
        name: '租赁出库',
        path: '/transfer/out/create',
      },
      {
        name: '租赁入库',
        path: '/transfer/in/create',
      },
      {
        name: '暂存出库',
        path: '/transfer_free/out/create',
      },
      {
        name: '暂存入库',
        path: '/transfer_free/in/create',
      },
      {
        name: '盘点入库',
        path: '/stocktaking/in/create',
        roles: ['系统管理员', '基地仓库管理员'],
      },
      {
        name: '盘点出库',
        path: '/stocktaking/out/create',
        roles: ['系统管理员', '基地仓库管理员'],
      },
    ]
  },
  {
    name: '仓库查询',
    icon: Search,
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
        name: '合同',
        path: '/contract',
      },
      {
        name: '合同计算方案',
        path: '/plan',
      },
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
    ]
  },
  {
    name: '系统信息',
    icon: Settings,
    roles: ['系统管理员', '基地仓库管理员'],
    children: [
      {
        name: '基础配置',
        path: '/settings',
      },
      {
        name: '产品信息',
        path: '/product',
      },
      {
        name: '租金方案',
        path: '/price',
      },
      {
        name: '计重方案',
        path: '/weight',
      },
      {
        name: '操作员管理',
        path: '/operator',
        roles: ['系统管理员'],
      },
      {
        name: '客户列表',
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

const MenuList = ({ user, store, classes }) => {
  const [open, setOpen] = useState({})
  const navigate = useNavigate()
  const handleClick = (item) => {
    if (item.path) {
      navigate(item.path)
    }
    setOpen(open => ({
      [item.name]: !open[item.name]
    }))
  }
  useEffect(() => {
    // 第一次页面加载时，根据路径展开目录
    allMenu.forEach(menuItem => {
      if (menuItem.children) {
        menuItem.children.forEach(subMenuItem => {
          if (matchPath(subMenuItem.path, document.location.pathname)) {
            setOpen({
              [menuItem.name]: true
            })
          }
        })
      }
    })
  }, [])

  const getFilteredMenu = (menu) => {
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

  const menu = getFilteredMenu(allMenu)

  return (
    <div className={classes.root}>
      <List component="nav">
        {menu.map(menuItem =>
        (<div key={menuItem.name}>
          <MenuItem
            button
            onClick={() => handleClick(menuItem)}
            selected={!menuItem.children && matchPath(menuItem.path, document.location.pathname)}
          >
            <ListItemIcon>
              <menuItem.icon />
            </ListItemIcon>
            <ListItemText inset primary={menuItem.name} />
            {menuItem.children && (open[menuItem.name] ? <ExpandLess /> : <ExpandMore />)}
          </MenuItem>
          {menuItem.children && (<Collapse in={open[menuItem.name]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menuItem.children.map(subMenuItem => (
                <MenuItem
                  onClick={() => navigate(subMenuItem.path)}
                  button
                  key={subMenuItem.name}
                  className={classes.nested}
                  selected={matchPath(subMenuItem.path, document.location.pathname)}
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

MenuList.classes = PropTypes.object.isRequired

export default withStyles(styles)(MenuList)
