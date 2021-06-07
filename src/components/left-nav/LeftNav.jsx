import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";
import menuList from "../../config/menuConfig.js";
import memoryUtils from "../../utils/memoryUtils.js";
import "./leftNav.less";
const { SubMenu } = Menu;
/**
 * 管理页面左侧的导航组件
 */
class LeftNav extends Component {
  //获取菜单的节点方法。
  getMenuNodes = menuList => {
    return menuList.map(item => {
      //如果item没有children项,返回一级菜单
      if (this.hasAuth(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          );
        } else {
          //有children项情况
          const path = this.props.location.pathname;
          const cItem = item.children.find(
            cItem => path.indexOf(cItem.key) === 0
          );
          if (cItem) {
            this.openKey = item.key;
          }
          //返回2级菜单
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          );
        }
      }
      return undefined;
    });
  };
  hasAuth = item => {
    const { key, isPublic } = item;
    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    if (username === "admin" || isPublic || menus.includes(key)) {
      return true;
    } else if (item.children) {
      return !!item.children.find(child => menus.includes(child.key));
    }
    return false;
  };
  //组件挂载之前的生命周期方法
  UNSAFE_componentWillMount() {
    this.MenuList = this.getMenuNodes(menuList);
  }
  //渲染函数
  render() {
    const openKey = this.openKey;
    let path = this.props.location.pathname;
    if (path.indexOf("/product") === 0) {
      path = "/product";
    }
    return (
      <div className='left-nav'>
        <Link to='/home' className='left-nav-header'>
          <img
            src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K'
            alt='logo'
          />
          <h1>商品管理后台</h1>
        </Link>
        <Menu
          mode='inline'
          theme='dark'
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {this.MenuList}
        </Menu>
      </div>
    );
  }
}
export default withRouter(LeftNav);
