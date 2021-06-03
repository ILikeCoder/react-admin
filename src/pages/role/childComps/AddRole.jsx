import React, { Component } from "react";
import { Form, Input } from "antd";
const Item = Form.Item;
export default class AddForm extends Component {
  //创建的Ref对象
  formRef = React.createRef();

  UNSAFE_componentWillMount() {
    this.props.setForm(this.formRef);
  }
  //组件挂载前生命周期回调
  render() {
    return (
      <Form ref={this.formRef}>
        <Item
          label='角色名称'
          name='roleName'
          rules={[{ required: true, message: "角色名称必须输入" }]}
        >
          <Input />
        </Item>
      </Form>
    );
  }
}
