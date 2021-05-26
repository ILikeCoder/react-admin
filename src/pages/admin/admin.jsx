import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Layout } from "antd";
import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav/LeftNav";
import Header from "../../components/header/Header";
const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
  render() {
    let user = memoryUtils.user;
    if (!user || !user._id) return <Redirect to='/login' />;
    return (
      <Layout style={{ height: "100%" }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ backgroundColor: "#fff" }}>Content</Content>
          <Footer style={{ textAlign: "center", color: "#ccc" }}>
            推荐使用谷歌浏览器，可以获得最佳操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
