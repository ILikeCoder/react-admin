import React, { Component } from "react";
import { Card } from "antd";
import ReactEcharts from "echarts-for-react";
/**
 * 柱状图路由
 */
export default class Pie extends Component {
  getOption = () => {
    return {
      title: {
        text: "南丁格尔玫瑰图",
        subtext: "纯属虚构",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        left: "center",
        top: "bottom",
        data: [
          "rose1",
          "rose2",
          "rose3",
          "rose4",
          "rose5",
          "rose6",
          "rose7",
          "rose8",
        ],
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: "半径模式",
          type: "pie",
          radius: [20, 140],
          center: ["25%", "50%"],
          roseType: "radius",
          itemStyle: {
            borderRadius: 5,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
            },
          },
          data: [
            { value: 40, name: "rose 1" },
            { value: 33, name: "rose 2" },
            { value: 28, name: "rose 3" },
            { value: 22, name: "rose 4" },
            { value: 20, name: "rose 5" },
            { value: 15, name: "rose 6" },
            { value: 12, name: "rose 7" },
            { value: 10, name: "rose 8" },
          ],
        },
        {
          name: "面积模式",
          type: "pie",
          radius: [20, 140],
          center: ["75%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 5,
          },
          data: [
            { value: 30, name: "rose 1" },
            { value: 28, name: "rose 2" },
            { value: 26, name: "rose 3" },
            { value: 24, name: "rose 4" },
            { value: 22, name: "rose 5" },
            { value: 20, name: "rose 6" },
            { value: 18, name: "rose 7" },
            { value: 16, name: "rose 8" },
          ],
        },
      ],
    };
  };
  getOption1 = () => {
    return {
      title: {
        text: "某站点用户访问来源",
        subtext: "纯属虚构",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "搜索引擎" },
            { value: 735, name: "直接访问" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "联盟广告" },
            { value: 300, name: "视频广告" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  };
  render() {
    return (
      <div>
        <Card title='饼图一'>
          <ReactEcharts option={this.getOption()} />
        </Card>

        <Card title='饼图二'>
          <ReactEcharts option={this.getOption1()} />
        </Card>
      </div>
    );
  }
}
