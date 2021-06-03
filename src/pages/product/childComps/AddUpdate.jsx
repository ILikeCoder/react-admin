import React, {  PureComponent } from "react";
import { Card, Form, Input, Cascader, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LinkButton from "../../../components/linkButton/LinkButton";
import PicturesWall from "./PicturesWall";
import RichTextEditor from "./RichTextEditor";
import { reqCategoryList, reqUpdateOrAddProduct } from "../../../api";
const { Item } = Form;
const { TextArea } = Input;
export default class AddUpdate extends PureComponent {
  state = {
    options: [],
  };

  picturesWallRef = React.createRef();
  editorRef = React.createRef();
  //表单全部验证成功的函数
  handleFinish = async values => {
    //收集数据，并封装成product对象
    const {
      productName: name,
      productDesc: desc,
      productPrice: price,
      productCategory,
    } = values;
    let pCategoryId, categoryId;
    if (productCategory.length === 1) {
      pCategoryId = "0";
      categoryId = productCategory[0];
    } else {
      pCategoryId = productCategory[0];
      categoryId = productCategory[1];
    }
    const imgs = this.picturesWallRef.current.getImages();
    const editor = this.editorRef.current.getDetail();
    const product = {
      name,
      desc,
      price,
      imgs,
      detail: editor,
      pCategoryId,
      categoryId,
    };
    if (this.isUpdate) {
      product._id = this.product._id;
    }
    //发送请求
    const res = await reqUpdateOrAddProduct(product);
    if (res.status === 0) {
      message.success((this.isUpdate ? "更新" : "添加") + "商品成功！");
      this.props.history.goBack();
    } else {
      message.error((this.isUpdate ? "更新" : "添加") + "商品失败！");
    }
  };
  //初始化状态中的options
  initOptions = async categoryList => {
    // 根据categoryList生成options数组
    const options = categoryList.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }));
    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategoryList(pCategoryId);
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId);
      // 关联对应的一级option上
      targetOption.children = childOptions;
    }
    // 更新options状态
    this.setState({
      options,
    });
  };

  //获取分类列表
  getCategoryList = async parentId => {
    const res = await reqCategoryList(parentId);
    if (res.status === 0) {
      const categoryList = res.data;
      //ID为0 返回1级列表
      if (parentId === "0") {
        this.initOptions(categoryList);
      } else {
        //否则返回2级列表
        return categoryList;
      }
    }
  };

  //加载下一级的分类列表的函数
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;
    const subCategoryList = await this.getCategoryList(targetOption.value);
    targetOption.loading = false;
    if (subCategoryList && subCategoryList.length > 0) {
      const childOptions = subCategoryList.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true,
      }));

      targetOption.children = childOptions;
    } else {
      targetOption.isLeaf = true;
    }
  };
  UNSAFE_componentWillMount() {
    //如果添加没值,否则有值
    const product = this.props.location.state;
    this.isUpdate = !!product;
    this.product = product || {};
  }
  //组件挂载完成的生命周期
  componentDidMount() {
    this.getCategoryList("0");
  }
  //render渲染函数
  render() {
    const { isUpdate, product } = this;
    const { pCategoryId, categoryId, imgs, detail } = product;
    const categoryIds = [];
    if (isUpdate) {
      if (pCategoryId === "0") {
        categoryIds.push(categoryId);
      } else {
        categoryIds.push(pCategoryId, categoryId);
      }
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.replace("/product/home")}>
          <ArrowLeftOutlined style={{ fontSize: 20, marginRight: 10 }} />
        </LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );
    const formItemLayout = {
      labelCol: { span: 2 }, // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    };
 
    return (
      <Card title={title}>
        <Form
          onFinish={this.handleFinish}
          {...formItemLayout}
          initialValues={{
            productName: product.name,
            productDesc: product.desc,
            productPrice: product.price,
            productCategory: categoryIds,
          }}
        >
          <Item
            label='商品名称'
            name='productName'
            rules={[{ required: true, message: "输入商品名称" }]}
          >
            <Input placeholder='请输入商品名称'></Input>
          </Item>
          <Item
            label='商品描述'
            name='productDesc'
            rules={[{ required: true, message: "输入商品名称" }]}
          >
            <TextArea
              placeholder='请输入商品描述'
              autoSize={{ minRows: 2, maxRows: 6 }}
            ></TextArea>
          </Item>
          <Item
            label='商品价格'
            name='productPrice'
            rules={[
              { required: true, message: "输入商品价格" },
              {
                validator(_, value) {
                  if (value > 0) return Promise.resolve();
                  return Promise.reject(new Error("输入的价格必须大于0"));
                },
              },
            ]}
          >
            <Input
              type='number'
              placeholder='请输入商品价格'
              addonAfter='元'
            ></Input>
          </Item>
          <Item
            label='商品分类'
            name='productCategory'
            rules={[{ required: true, message: "必须选择商品分类" }]}
          >
            <Cascader
              placeholder='请选择商品分类'
              options={this.state.options}
              loadData={this.loadData}
            />
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.picturesWallRef} imgs={imgs} />
          </Item>
          <Item
            label='商品详情'
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.editorRef} detail={detail} />
          </Item>
          <Item>
            <Button type='primary' htmlType='submit'>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}
