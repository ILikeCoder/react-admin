import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Modal, Button } from "antd";
import { getUser } from "../../utils/storageUtils.js";
import { formateDate } from "../../utils/dateUtils";
import { reqWeather } from "../../api";
import menuList from "../../config/menuConfig";
import { removeUser } from "../../utils/storageUtils";
import memoryUtils from "../../utils/memoryUtils";
import "./header.less";
/**
 * 管理页面的头部组件
 */
class Header extends Component {
  //组件的状态
  state = {
    currentTime: formateDate(Date.now()),
    weather: "",
    city: "",
  };
  //获取时间方法
  getTime = () => {
    // 定时器每秒更新一次
    this.timerID = setInterval(() => {
      //获取最新的时间，并用格式化。
      let currentTime = formateDate(Date.now());
      //赋值state为最新的时间
      this.setState({ currentTime });
    }, 1000);
  };
  //获取天气的方法
  getWeather = async () => {
    const { city, weather } = await reqWeather(510100);
    this.setState({
      city,
      weather,
    });
  };
  //获取标题的方法
  getTitle = () => {
    //取到当前路径
    const { pathname } = this.props.location;
    let title;
    //遍历menuList数据
    menuList.forEach(item => {
      //如果找到了对应的key===pathname 将title赋值为有效值
      if (item.key === pathname) {
        title = item.title;
      } else if (item.children) {
        //如果没有找到上面的key进入第二个判断
        //在item中的子列表(children)查找 key===pathname
        const cItem = item.children.find(
          cItem => pathname.indexOf(cItem.key) === 0
        );
        //如果cItem有值在赋值给title
        if (cItem) title = cItem.title;
      }
    });
    return title;
  };
  //退出登录的方法
  logout = () => {
    Modal.confirm({
      content: "确定退出吗？",
      onOk: () => {
        //清除localStorage中的用户信息方法。
        removeUser();
        //将内存中user信息赋值为{}
        memoryUtils.user = {};
        //路由替换为/login
        this.props.history.replace("/login");
      },
    });
  };
  //组件挂载完成生命周期
  componentDidMount() {
    this.getTime();
    this.getWeather();
  }
  //组件卸载之前的生命周期
  componentWillUnmount() {
    //在组件卸载前,执行清除循环定时器
    clearInterval(this.timerID);
  }
  render() {
    //用户信息
    const { username } = getUser();
    //标题
    const title = this.getTitle();
    //当前时间，城市，天气
    const { currentTime, city, weather } = this.state;
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <Button type='primary' onClick={this.logout}>
            退出
          </Button>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span className='time'>{currentTime}</span>
            <span>{city}</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
