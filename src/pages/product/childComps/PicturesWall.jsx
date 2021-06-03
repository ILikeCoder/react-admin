import React, { Component } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reqDeleteImg } from "../../../api";
import { BASE_IMG_URL } from "../../../utils/constans";

/*
用于图片上传的组件
 */
export default class PicturesWall extends Component {
  constructor(props) {
    super(props);
    let fileList = [];
    //从props中取出imgs数组
    const { imgs } = this.props;
    //如果imgs有值并且长度大于0
    if (imgs && imgs.length > 0) {
      //加工这个数组 返回一个对象数组
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: "done",
        url: BASE_IMG_URL + img,
      }));
    }
    //设置状态
    this.state = {
      previewVisible: false, // 标识是否显示大图预览Modal
      previewImage: "", // 大图的url
      fileList, //图片数据
    };
  }
  /*
  隐藏Modal
   */
  handleCancel = () => this.setState({ previewVisible: false });
  //显示大图片预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange = async ({ file, fileList }) => {
    //上传成功了
    if (file.status === "done") {
      const res = file.response;
      //查看相应的状态是否为0
      if (res.status === 0) {
        message.success("上传图片成功");
        const { name } = res.data;
        fileList[fileList.length - 1].name = name;
        fileList[fileList.length - 1].url = BASE_IMG_URL + name;
      } else {
        message.error("上传图片失败");
      }
      //如果是删除操作
    } else if (file.status === "removed") {
      //发送删除的请求函数
      const res = await reqDeleteImg(file.name);
      if (res.status === 0) {
        message.error("删除图片成功！");
      } else {
        message.error("删除图片失败！");
      }
    }
    //更新状态
    this.setState({ fileList });
  };
  //获取已经上传的图片数据  //目的是：获取已经上传的图片数据 在父组件中提交添加商品
  getImages = () => {
    return this.state.fileList.map(file => file.name);
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action='http://39.100.225.255:5000/manage/img/upload'
          listType='picture-card' /*卡片样式*/
          accept='image/*'
          name='image'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length < 5 && uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='example' style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
