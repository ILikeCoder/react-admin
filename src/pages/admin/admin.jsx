import React, { Component } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { Layout } from "antd";
import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav/LeftNav";
import Header from "../../components/header/Header";

// 引入所有子路由组件
import Category from "../category/Category";
import Home from "../home/Home";
import Product from "../product/Product";
import Role from "../role/Role";
import User from "../user/User";
import Pie from "../charts/Pie";
import Bar from "../charts/Bar";
import Line from "../charts/Line";
import Order from "../order/Order";

const { Footer, Sider, Content } = Layout;

/**
 * 管理页面路由
 */
export default class Admin extends Component {
  render() {
    let user = memoryUtils.user;
    if (!user || !user._id) return <Redirect to='/login' />;
    return (
      <Layout style={{ minHeight: "100%" }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin: "15px 15px", backgroundColor: "#fff" }}>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Route path='/order' component={Order} />
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center", color: "#333" }}>
            推荐使用谷歌浏览器，可以获得最佳操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
