import React from 'react'
import { withStyles } from 'material-ui/styles'
import List, { ListItemText } from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import Collapse from 'material-ui/transitions/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'


const menu = [
  {
    name: '仪表盘',
    path: '/dashboard',
  },
  {
    name: '仓库操作',
    children: [
      {
        name: '采购入库',
        path: '/purchase/in/create',
      },
      {
        name: '销售出库',
        path: '/purchase/out/create'
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
      },
      {
        name: '盘点亏损出库',
        path: '/stocktaking/out/create',
      },
    ]
  },
  {
    name: '仓库查询',
    children: [
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
      {
        name: '采购入库明细表',
        path: '/purchase_table',
      },
      {
        name: '销售出库明细表',
        path: '/sell_table',
      },
      {
        name: '调拨入库明细表',
        path: '/transfer_in_table',
      },
      {
        name: '调拨出库明细表',
        path: '/transfer_out_table',
      },
      {
        name: '盘点盈余入库明细表',
        path: '/stocktaking_in_table',
      },
      {
        name: '盘点亏损出库明细表',
        path: '/stocktaking_out_table',
      },
    ]
  },
  {
    name: '系统信息',
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
        name: '新增操作员',
        path: '/operator/create',
      },
      {
        name: '操作员列表',
        path: '/operator',
      },
      {
        name: '新增项目',
        path: '/project/create',
      },
      {
        name: '项目列表',
        path: '/project',
      },
    ]
  },
  {
    name: '公司',
    children: [
      {
        name: '租金计算',
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
  }
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
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

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
    menu.forEach(menuItem => {
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

  render() {
    const { classes } = this.props
    const { router } = this.context

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

MenuList.propTypes = {
  classes: React.PropTypes.object.isRequired,
};

export default  withStyles(styles)(MenuList);