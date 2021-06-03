import React, { Component } from "react";
import { Form, Input, Select } from "antd";
const Item = Form.Item;
const Option = Select.Option;
export default class UserForm extends Component {
  FormRef = React.createRef();
  UNSAFE_componentWillMount() {
    this.props.setAddForm(this.FormRef);
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 16 }, // 右侧包裹的宽度
    };
    const { roles } = this.props;
    return (
      <Form {...formItemLayout} ref={this.FormRef}>
        <Item
          label='用户名'
          name='username'
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
          ]}
        >
          <Input placeholder='请输入用户名' />
        </Item>
        <Item
          label='手机号'
          name='phone'
          rules={[
            {
              required: true,
              message: "请输入手机号",
            },
          ]}
        >
          <Input placeholder='请输入手机号' />
        </Item>

        <Item
          label='密码'
          name='password'
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
          ]}
        >
          <Input type='password' placeholder='请输入密码' />
        </Item>

        <Item
          label='邮箱'
          name='email'
          rules={[
            {
              required: true,
              message: "请输入邮箱",
            },
          ]}
        >
          <Input placeholder='请输入邮箱' />
        </Item>
        <Item
          label='角色'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          name='role_id'
          rules={[
            {
              required: true,
              message: "请输入选择角色",
            },
          ]}
        >
          <Select placeholder='请选择角色'>
            {roles.map(role => (
              <Option value={role._id} key={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    );
  }
}
