import jsonp from "jsonp";
import { message } from "antd";
import axios from "axios";
//axios默认基础地址->URL
axios.defaults.baseURL = "http://39.100.225.255:5000";

//成都天气城市代码 510100 ->JSONP请求
export const reqWeather = cityCode => {
  return new Promise(resolve => {
    let url = `https://restapi.amap.com/v3/weather/weatherInfo?parameters&key=0dc0b93ff761645a6ac95b9cfa7824f2&city=${cityCode}`;
    jsonp(url, {}, (err, data) => {
      if (data.status === "1") {
        // 成功了
        resolve(data.lives[0]);
      } else {
        message.success(err);
      }
    });
  });
};

/**
 * ajax函数 用于封装axios发送请求
 * @param {*} url  请求地址
 * @param {*} data 请求参数
 * @param {*} type 请求方式
 * @returns  Promise
 */
function ajax(url, data = {}, type = "GET") {
  return new Promise(resolve => {
    let promise;
    if (type === "GET") {
      promise = axios.get(url, {
        params: data,
      });
    } else {
      promise = axios.post(url, data);
    }
    promise.then(response => {
      resolve(response.data);
    });
    promise.catch(error => {
      message.error(`请求出错了:${error.message}`);
    });
  });
}

//登录请求接口
export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");

//获取一级or二级分类的列表
export const reqCategoryList = parentId =>
  ajax("/manage/category/list", { parentId });

//添加分类
export const reqAddCategory = ({ categoryName, parentId }) =>
  ajax("/manage/category/add", { categoryName, parentId }, "POST");

//更新分类
export const reqUpdateCategory = ({ categoryName, categoryId }) =>
  ajax("/manage/category/update", { categoryName, categoryId }, "POST");

// 获取商品分页的列表
export const reqProducts = (pageNum, pageSize) =>
  ajax("/manage/product/list", {
    pageNum,
    pageSize,
  });

//搜索商品的分页信息
export const reqSearchProduct = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax("/manage/product/search", {
    pageNum,
    pageSize,
    searchName,
    [searchType]: searchName,
  });

//根据分类ID获取分类名称
export const reqCategory = categoryId =>
  ajax("/manage/category/info", { categoryId });

//更新商品的状态
export const reqUpdateStatus = (productId, status) =>
  ajax("/manage/product/updateStatus", { productId, status }, "POST");

//删除已经上传的图片
export const reqDeleteImg = name =>
  ajax("/manage/img/delete", { name }, "POST");

//添加或更新商品
export const reqUpdateOrAddProduct = product =>
  ajax("/manage/product/" + (product._id ? "update" : "add"), product, "POST");

//获取角色信息

export const reqRoles = () => ajax("/manage/role/list");

// 添加角色
export const reqAddRoles = roleName =>
  ajax("/manage/role/add", { roleName }, "POST");

//更新角色权限
export const reqUpdateRole = role => ajax("/manage/role/update", role, "POST");

//获取用户列表
export const reqUserList = () => ajax("/manage/user/list");

export const reqAddUser = user => ajax("/manage/user/add", user, "POST");

export const reqUpdateUser = user => ajax("/manage/user/update", user, "POST");

export const reqDeleteUser = userId =>
  ajax("/manage/user/delete", { userId }, "POST");
