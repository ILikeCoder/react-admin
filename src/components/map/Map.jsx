import React, { Component } from "react";

export default class Map extends Component {
  componentDidMount() {
    // eslint-disable-next-line no-undef
    new AMap.Map("container", {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 11, //初始化地图层级
      center: [104.065735, 30.659462], //初始化地图中心点
    });
  }
  render() {
    return <div id='container' style={{ height: "100%", width: "100%" }}></div>;
  }
}
