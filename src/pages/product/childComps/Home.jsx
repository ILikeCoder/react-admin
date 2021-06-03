import React, { Component } from "react";
import { Select, Input, Button, Card, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LinkButton from "../../../components/linkButton/LinkButton";
import { reqProducts, reqSearchProduct, reqUpdateStatus } from "../../../api";
import { PAGE_SIZE } from "../../../utils/constans";
const Option = Select.Option;
export default class Home extends Component {
  //状态
  state = {
    total: 0, //后台分页的总数据条数
    productList: [], //商品列表
    isLoading: false, //是否加载中，默认为不加载
    searchName: "", //搜索的名称
    searchType: "productName", //默认的搜索类型->商品名称
  };
  //初始化列表
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        width: 100,
        render: price => "￥" + price,
      },
      {
        title: "状态",
        width: 100,
        render: product => {
          const { status, _id } = product;
          let newStatus = status === 1 ? 2 : 1;
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        title: "操作",
        width: 100,
        render: product => {
          return (
            <span>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/detail", { product })
                }
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/addupdate", product)
                }
              >
                修改
              </LinkButton>
            </span>
          );
        },
      },
    ];
  };
  updateStatus = async (id, status) => {
    //发送更新商品的请求数据
    const res = await reqUpdateStatus(id, status);
    //返回状态为0更新成功
    if (res.status === 0) {
      message.success("更新商品状态成功!");
      //重新更新当前页的数据显示
      this.getProductList(this.pageNum);
    }
  };
  //获取产品列表数据
  getProductList = async pageNum => {
    //最开始发送请求时就将当前页数保存
    this.pageNum = pageNum;
    //在状态中读到搜索的名字和搜索的类型
    const { searchName, searchType } = this.state;
    //数据加载中
    this.setState({ isLoading: true });

    let res;
    //如果searchName有值
    if (searchName) {
      //搜索商品的请求   进入这个if 说明是搜索框的查询请求
      res = await reqSearchProduct({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
    } else {
      //一般分页
      res = await reqProducts(pageNum, PAGE_SIZE);
    }
    //加载完成
    this.setState({ isLoading: false });
    //返回状态为0 说明请求成功了
    if (res.status === 0) {
      //拿到返回的数据总条数和商品列表
      const { total, list: productList } = res.data;
      //更新状态
      this.setState({ productList, total });
    }
  };
  UNSAFE_componentWillMount() {
    //初始化列数据
    this.initColumns();
  }
  componentDidMount() {
    //获取第一页数据
    this.getProductList(1);
  }
  render() {
    //状态中读相关属性
    const { productList, total, isLoading, searchName, searchType } =
      this.state;
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={e => this.setState({ searchName: e.target.value })}
        />
        <Button type='primary' onClick={() => this.getProductList(1)}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={() => this.props.history.push("/product/addupdate")}
      >
        添加商品
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          loading={isLoading}
          rowKey='_id'
          dataSource={productList}
          columns={this.columns}
          pagination={{
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProductList,
            current: this.pageNum,
          }}
        />
      </Card>
    );
  }
}
