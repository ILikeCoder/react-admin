import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AddUpdate from "./childComps/AddUpdate";
import Detail from "./childComps/Detail";
import Home from "./childComps/Home";
import "./product.less";
/**
 * 产品路由
 */
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product' component={Home} exact /> {/*路径完全匹配*/}
        <Route path='/product/addupdate' component={AddUpdate} />
        <Route path='/product/detail' component={Detail} />
        <Redirect to='/product' />
      </Switch>
    );
  }
}
