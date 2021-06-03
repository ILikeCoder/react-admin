import React, { Component } from "react";
import { Form, Input, Select } from "antd";
const Item = Form.Item;
const Option = Select.Option;
export default class UserForm extends Component {
  FormRef = React.createRef();
  UNSAFE_componentWillMount() {
    this.props.setUpdateForm(this.FormRef);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.FormRef.current.setFieldsValue({
      currentUsername: nextProps.user.username,
      currentPhone: nextProps.user.phone,
      currentEmail: nextProps.user.email,
      currentRole_id: nextProps.user.role_id,
    });
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 16 }, // 右侧包裹的宽度
    };
    const { roles, user } = this.props;

    return (
      <Form
        {...formItemLayout}
        ref={this.FormRef}
        initialValues={{
          currentUsername: user.username,
          currentPhone: user.phone,
          currentEmail: user.email,
          currentRole_id: user.role_id,
        }}
      >
        <Item
          label='用户名'
          name='currentUsername'
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
          name='currentPhone'
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
          label='邮箱'
          name='currentEmail'
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
          name='currentRole_id'
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
