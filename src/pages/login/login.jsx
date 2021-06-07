import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { reqLogin } from "../../api";
import { saveUser } from "../../utils/storageUtils";
import memoryUtils from "../../utils/memoryUtils";
import "./login.less";

const Item = Form.Item;

/**
 * 登录页面路由
 */
export default class Login extends Component {
  //登录时表单验证成功的回调
  onFinish = async values => {
    //结构赋值username,password
    const { username, password } = values;
    //发送ajax请求
    const res = await reqLogin(username, password);
    //返回的状态码不等于0 直接退出函数并提示错误消息
    if (res.status !== 0) return message.error(res.msg);
    //存储登录成功的用户名
    memoryUtils.user = res.data;
    saveUser(res.data);
    // 提示信息
    message.success("登录成功");
    // 路由跳转
    this.props.history.replace("/");
  };

  //组件的渲染函数
  render() {
    let user = memoryUtils.user;
    if (user && user._id) return <Redirect to='/' />;

    return (
      <div className='login'>
        <header className='login-header'>
          <img
            src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K'
            alt='logo'
          />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            name='normal_login'
            className='login-form'
          >
            <Item
              name='username'
              initialValue='admin'
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
