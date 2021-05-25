import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.less";
import logo from "./images/logo.png";

const Item = Form.Item;
export default class Login extends Component {
  formRef = React.createRef();
  //登录时表单验证成功的回调
  onFinish = values => {
    console.log(values);
  };
  //表单验证失败的回调函数
  onFinishFailed = () => {};
  render() {
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo' />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            name='normal_login'
            className='login-form'
          >
            <Item
              name='username'
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
                {
                  min: 4,
                  message: "用户名最短4位",
                },
                {
                  max: 12,
                  message: "用户名不能超过12位",
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名必须是英文、数字或下划线组成",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder='Username'
              />
            </Item>
            <Item
              name='password'
              rules={[
                {
                  required: true,
                  message: "请输入密码!",
                },
                {
                  min: 4,
                  message: "密码最短4位",
                },
                {
                  max: 12,
                  message: "密码不能超过12位",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                type='password'
                placeholder='Password'
                rules={[{ required: true, message: "请输入您的密码！" }]}
              />
            </Item>
            <Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}
