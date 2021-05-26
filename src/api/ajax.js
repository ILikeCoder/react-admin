import { message } from "antd";
import axios from "axios";
/**
 * ajax函数 用于封装axios发送请求
 * @param {*} url  请求地址
 * @param {*} data 请求参数
 * @param {*} type 请求方式
 * @returns  Promise
 */
axios.defaults.baseURL = "http://39.100.225.255:5000";
export default function ajax(url, data = {}, type = "GET") {
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
