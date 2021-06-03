import React, { Component } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from "../../api";
import LinkButton from "../../components/linkButton/LinkButton";
import UpdateForm from "./childComp/UpdateForm";
import AddForm from "./childComp/AddForm";
/**
 * 商品分类路由
 */
export default class Category extends Component {
  state = {
    //表格数据源 ->1级
    categoryList: [],
    //二级分类的列表数据
    subCategoryList: [],
    //是否加载中
    isLoading: false,
    //分类id
    parentId: "0",
    //分类名称
    parentName: "",
    //模态框显示与隐藏的数据
    showStatus: 0,
  };

  //初始化列的数据方法
  initColumns = () => {
    // 列数据
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "操作",
        width: 300,
        key: "address",
        render: category => (
          /**category当前的item项 */
          <span>
            <LinkButton onClick={() => this.updateCategory(category)}>
              修改分类
            </LinkButton>
            {/**parentId为0时才显示查看子分类标签 */}
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.getSubCategoryList(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };
  //获取一级or二级 分类列表
  getCategoryList = async (parentId = this.state.parentId) => {
    //显示加载中效果
    this.setState({ isLoading: true });
    //发送获取分类列表的请求
    let res = await reqCategoryList(parentId);
    //隐藏加载中效果
    this.setState({ isLoading: false });
    if (res.status === 0) {
      // 请求成功了
      let categoryList = res.data;
      //判断传入的父分类ID
      parentId === "0"
        ? this.setState({ categoryList })
        : this.setState({ subCategoryList: categoryList });
    } else {
      message.error("请求分类列表数据失败了");
    }
  };
  // 获取二级分类列表的方法
  getSubCategoryList({ name, _id }) {
    //setState状态更新是异步的。第二个参数在状态更新完成之后在执行。
    this.setState({ parentName: name, parentId: _id }, () => {
      this.getCategoryList();
    });
  }
  //显示一级分类的列表
  showCategoryList = () => {
    //改变状态,动态切换显示的分类列表
    this.setState({ parentName: "", parentId: "0", subCategoryList: [] });
  };
  /**
   * 添加分类的3个方法
   */
  //添加分类事件
  addCategory = () => {
    //判断form有没有值，有值的换利用form对象的setFieldsValue来动态改变initialValues的值
    if (this.form) {
      this.form.current.setFieldsValue({ parentId: this.state.parentId });
    }
    //显示添加模态框
    this.setState({ showStatus: 1 });
  };
  //添加完成事件
  handleAdd = async () => {
    //在添加完成的时候进行表单验证，如果验证通过了就会执行then方法里的回调函数
    this.form.current.validateFields().then(async values => {
      //冲当前的表单信息中拿到对应的分类名称和父分类ID
      const { categoryName, parentId } = values;
      //发送添加分类的请求
      const res = await reqAddCategory({ categoryName, parentId });
      //判断返回的请求状态是否为0  0为成功/1为失败
      if (res.status === 0) {
        //在判断当前的分类ID和状态中的分类ID是否一致
        if (parentId === this.state.parentId) {
          //如果一致获取最新列表
          this.getCategoryList();
        } else if (parentId === "0") {
          //不一致情况，说明是在一级分类中添加分类。直接获取最新的一级分类。
          this.getCategoryList(parentId);
        }
      }
      //将表单重置为空
      this.form.current.resetFields();
      //关闭模态框显示
      this.setState({ showStatus: 0 });
    });
  };
  //取消添加事件
  cancelAdd = () => {
    //重置表单
    this.form.current.resetFields();
    //关闭模态框
    this.setState({ showStatus: 0 });
  };

  /**
   * 修改分类的3个方法
   */
  //修改分类事件
  updateCategory = category => {
    //将当前传入的category保存到this中
    this.category = category;
    //判断form有值吗
    if (this.form) {
      // 利用form对象的setFieldsValue的方法设置initialValue的值
      this.form.current.setFieldsValue({ categoryName: category.name });
    }
    //显示对话框
    this.setState({ showStatus: 2 });
  };
  //修改完成事件
  handleUpdate = () => {
    //表单验证通过
    this.form.current.validateFields().then(async value => {
      //准备发请求的数据
      const categoryId = this.category._id;
      //品类名称
      const { categoryName } = value;
      //发送更新分类的请求
      const res = await reqUpdateCategory({ categoryName, categoryId });
      //返回状态为0的在更新分类列表数据
      if (res.status === 0) {
        //更新列表
        this.getCategoryList();
      }
      //隐藏modal框
      this.setState({ showStatus: 0 });
    });
  };
  //取消修改事件
  cancelUpdate = () => {
    //重置表单数据
    this.form.current.resetFields();
    //隐藏模态框
    this.setState({ showStatus: 0 });
  };
  //组件挂载前生命周期方法
  UNSAFE_componentWillMount() {
    //初始化表格中列数据
    this.initColumns();
  }
  // 组件挂载完成的生命周期方法
  componentDidMount() {
    //获取分类列表
    this.getCategoryList();
  }
  render() {
    //从状态中读取对应的属性
    const {
      categoryList,
      isLoading,
      parentId,
      parentName,
      subCategoryList,
      showStatus,
    } = this.state;
    //动态渲染标题列表
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategoryList}>一级分类列表</LinkButton>
          <ArrowRightOutlined style={{ color: "#1DA57A", marginRight: 10 }} />
          <span>{parentName}</span>
        </span>
      );
    let category = this.category || {};
    return (
      <Card
        title={title}
        extra={
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={this.addCategory}
          >
            添加
          </Button>
        }
      >
        <Table
          rowKey='_id'
          bordered
          dataSource={parentId === "0" ? categoryList : subCategoryList}
          columns={this.columns}
          loading={isLoading}
          pagination={{
            defaultPageSize: 5,
            showQuickJumper: true,
            showSizeChanger: false,
          }}
        />
        {/* 添加分类对话框 */}
        <Modal
          title='添加分类 Modal'
          visible={showStatus === 1}
          onOk={this.handleAdd}
          onCancel={this.cancelAdd}
        >
          <AddForm
            categoryList={categoryList}
            parentId={parentId}
            setForm={form => (this.form = form)}
          />
        </Modal>

        {/* 修改分类对话框 */}
        <Modal
          title='修改分类'
          visible={showStatus === 2}
          onOk={this.handleUpdate}
          onCancel={this.cancelUpdate}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={form => (this.form = form)}
          />
        </Modal>
      </Card>
    );
  }
}
