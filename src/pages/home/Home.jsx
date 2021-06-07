import React, { Component } from "react";
import "./home.less";
import { Card } from "antd";
/**
 * 首页路由
 *
 */
export default class Home extends Component {
  mapRef = React.createRef();
  componentDidMount() {
    // eslint-disable-next-line no-undef
    new AMap.Map(document.getElementById("container"), {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 11, //初始化地图层级
      center: [104.065735, 30.659462], //初始化地图中心点
    });
    document.getElementsByClassName("amap-logo")[0].remove();
    document.getElementsByClassName("amap-copyright")[0].remove();
  }
  render() {
    return (
      <Card title='地图预览'>
        <div
          id='container'
          ref={this.mapRef}
          style={{ height: "500px", width: "100%" }}
        ></div>
      </Card>
    );
  }
}
