import React, { Component } from "react";
import { Form, Select, Input } from "antd";
const Item = Form.Item;
const Option = Select.Option;
export default class AddForm extends Component {
  //创建的Ref对象
  formRef = React.createRef();
  //组件挂载前生命周期回调
  UNSAFE_componentWillMount() {
    this.props.setForm(this.formRef);
  }

  render() {
    const { categoryList, parentId } = this.props;
    return (
      <Form ref={this.formRef} initialValues={{ parentId }}>
        <Item name='parentId'>
          <Select>
            <Option value='0'>一级分类</Option>
            {categoryList.map(c => (
              <Option
                key={Math.random() * 1000 + c._id + Math.random() * 10000}
                value={c._id}
              >
                {c.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          name='categoryName'
          rules={[{ required: true, message: "分类名称必须输入" }]}
        >
          <Input />
        </Item>
      </Form>
    );
  }
}
