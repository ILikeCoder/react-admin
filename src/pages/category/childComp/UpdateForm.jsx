import React, { Component } from "react";
import { Form, Input } from "antd";
const Item = Form.Item;
export default class UpdateForm extends Component {
  //formRef  = ref对象
  formRef = React.createRef();
  UNSAFE_componentWillMount() {
    this.props.setForm(this.formRef);
  }
  render() {
    const { categoryName } = this.props;
    return (
      <Form ref={this.formRef} initialValues={{ categoryName }}>
        <Item
          name='categoryName'
          rules={[{ required: true, message: "分类名称必须输入" }]}
        >
          <Input placeholder='请输入分类名称' />
        </Item>
      </Form>
    );
  }
}
