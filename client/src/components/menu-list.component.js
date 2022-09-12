import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { canInsert } from '../utils'
import { Menu } from 'antd'
import { DashboardOutlined, FundOutlined, ProjectOutlined, SearchOutlined, SettingOutlined, ShopOutlined } from '@ant-design/icons'
import _ from 'lodash'

const allMenu = [
  {
    name: '仪表盘',
    path: '/dashboard',
    icon: <DashboardOutlined />,
  },
  {
    name: '仓库管理',
    icon: <ShopOutlined />,
    roles: ['项目部管理员', '系统管理员', '基地仓库管理员'],
    // TODO 解决这个权限特殊处理
    isInsertable: canInsert,
    children: [
      {
        name: '采购入库',
        path: '/record/create?type=purchase&direction=in',
        roles: ['系统管理员', '基地仓库管理员'],
      },
      {
        name: '销售出库',
        path: '/record/create?type=purchase&direction=out',
        roles: ['系统管理员', '基地仓库管理员'],
      },
      {
        name: '租赁入库',
        path: '/record/create?type=rent&direction=in',
      },
      {
        name: '租赁出库',
        path: '/record/create?type=rent&direction=out',
      },
      {
        name: '暂存入库',
        path: '/record/create?type=transfer&direction=in',
      },
      {
        name: '暂存出库',
        path: '/record/create?type=transfer&direction=out',
      },
      {
        name: '盘点入库',
        path: '/record/create?type=check&direction=in',
        roles: ['系统管理员', '基地仓库管理员'],
      },
      {
        name: '盘点出库',
        path: '/record/create?type=check&direction=out',
        roles: ['系统管理员', '基地仓库管理员'],
      },
    ]
  },
  {
    name: '仓库查询',
    icon: <SearchOutlined />,
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
    name: '项目管理',
    icon: <ProjectOutlined />,
    roles: ['系统管理员', '财务管理员', '基地仓库管理员'],
    children: [
      {
        name: '合同管理',
        path: '/contract',
      },
      {
        name: '计算方案',
        path: '/plan',
      },
      { // 临时
        name: '租金方案',
        path: '/price',
      },
      { // 临时
        name: '计重方案',
        path: '/weight',
      },
      {
        name: '员工档案',
        path: '/employee',
      },
      {
        name: '员工考勤',
        path: '/attendance',
      },
    ]
  },
  {
    name: '财务',
    icon: <FundOutlined />,
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
        name: '进项发票',
        path: '/invoice/in',
      },
      {
        name: '销项发票',
        path: '/invoice/out',
      },
      {
        name: '贷款管理',
        path: '/loan'
      },
      {
        name: '凭证录入',
        path: '/voucher',
      },
      {
        name: '科目设定',
        path: '/subject',
      },
    ]
  },
  {
    name: '系统信息',
    icon: <SettingOutlined />,
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
        name: '操作员管理',
        path: '/operator',
        roles: ['系统管理员'],
      },
      {
        name: '公司信息',
        path: '/company',
      },
      {
        name: '客户列表',
        path: '/project',
      },
    ]
  },
];


const MenuList = ({ user, store}) => {
  const [openKeys, setOpenKeys] = useState(['/dashboard']);
  const navigate = useNavigate()
  const location = useLocation()

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

  const items = menu.map(item => {
    const children = item.children ? item.children.map(subItem => ({ label: subItem.name, key: subItem.path })) : null
    const key = item.children ? item.name : item.path
    return ({ label: item.name, key, icon: item.icon, children })
  })
  const rootSubmenuKeys = menu.filter(item => item.children).map(item => item.name)
  const childMap = _.extend({}, ...menu
    .filter(item => item.children)
    .map(item => item.children.map(childItem => [childItem.path, item.name]))
    .map(_.fromPairs))

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  useEffect(() => {
    setOpenKeys([childMap[location.pathname + location.search]])
  }, [location.pathname, location.search])

  return <Menu items={items} mode='inline' defaultSelectedKeys={[location.pathname + location.search]} onOpenChange={onOpenChange} openKeys={openKeys} onSelect={v => navigate(v.key)} />
}

export default MenuList
