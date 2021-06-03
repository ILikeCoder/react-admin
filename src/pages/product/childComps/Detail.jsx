import React, { Component } from "react";
import { Card, List } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LinkButton from "../../../components/linkButton/LinkButton";
import { BASE_IMG_URL } from "../../../utils/constans";
import { reqCategory } from "../../../api";
const Item = List.Item;

export default class Detail extends Component {
  state = {
    parentName: "", //父分类名称
    subName: "", //子分类名称
  };
  async componentDidMount() {
    //在路由跳转的时候拿到路由跳转传递过来的参数，父ID和子ID
    const { pCategoryId, categoryId } = this.props.location.state.product;
    //如果父ID===0
    if (pCategoryId === "0") {
      //直接发送查询分类名称的请求 //参数为分类ID
      const res = await reqCategory(categoryId);
      //设置状态
      const parentName = res.data.name;
      this.setState({ parentName });
    } else {
      //通过Promise.all同时发送2个请求。
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      const parentName = results[0].data.name;
      const subName = results[1].data.name;
      //设置状态
      this.setState({
        parentName,
        subName,
      });
    }
  }
  render() {
    //从路由中取出携带产品对应的信息
    const { name, desc, price, detail, imgs } =
      this.props.location.state.product;
    //从状态中读取分类名称
    const { parentName, subName } = this.state;
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} />
        </LinkButton>
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title} className='product-detail'>
        <List grid={{ gutter: 10 }}>
          <Item>
            <span className='left'>商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格：</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类：</span>
            <span>
              {parentName} {subName ? "-->" + subName : ""}
            </span>
          </Item>
          <Item>
            <span className='left'>商品图片:</span>
            <span>
              {imgs.map(img => (
                <img
                  src={BASE_IMG_URL + img}
                  alt=''
                  className='product-img'
                  key={img}
                />
              ))}
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Item>
        </List>
      </Card>
    );
  }
}
