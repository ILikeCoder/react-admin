import React, { Component } from "react";
import { Button, Card } from "antd";
import ReactEcharts from "echarts-for-react";
/**
 * 柱状图路由
 */
export default class Bar extends Component {
  state = {
    sales: [5, 20, 36, 10, 10, 20],
    stores: [10, 30, 46, 20, 20, 30],
  };
  update = () => {
    this.setState(({ sales, stores }) => ({
      sales: sales.map(sale => ++sale),
      stores: stores.map(store => (store > 0 ? --store : 0)),
    }));
  };
  getOption = (sales, stores) => {
    return {
      title: {
        text: "ECharts柱形图",
      },
      tooltip: {},
      legend: {
        data: ["销量", "库存"],
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: sales,
        },
        {
          name: "库存",
          type: "bar",
          data: stores,
        },
      ],
    };
  };
  render() {
    const { sales, stores } = this.state;
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>
            更新
          </Button>
        </Card>

        <Card title='柱状图一'>
          <ReactEcharts option={this.getOption(sales, stores)} />
        </Card>
      </div>
    );
  }
}
