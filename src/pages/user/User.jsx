import React, { Component } from "react";
import { Table, Card, Button, Modal, message } from "antd";
import {
  reqAddUser,
  reqUpdateUser,
  reqDeleteUser,
  reqUserList,
} from "../../api";
import LinkButton from "../../components/linkButton/LinkButton";
import { formateDate } from "../../utils/dateUtils";
import AddForm from "./childComps/AddForm";
import UpdateForm from "./childComps/UpdateForm";
import { PAGE_SIZE } from "../../utils/constans";
/**
 * 用户路由
 */
export default class User extends Component {
  state = {
    userList: [],
    roles: [],
    createStatus: false,
    UpdateStatus: false,
  };
  //初始化列数据
  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },
      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: role_id =>
          this.state.roles.find(role => role._id === role_id).name,
      },
      {
        title: "操作",
        render: user => {
          return (
            <span>
              <LinkButton
                onClick={() => this.showUpdateUser(user)}
                style={{ marginRight: 15 }}
              >
                修改
              </LinkButton>
              <LinkButton
                onClick={() => {
                  this.deleteUser(user);
                }}
              >
                删除
              </LinkButton>
            </span>
          );
        },
      },
    ];
  };
  //获取用户列表
  getUserList = async () => {
    const res = await reqUserList();
    if (res.status === 0) {
      const { users: userList, roles } = res.data;
      this.setState({ userList, roles });
    }
  };
  //删除指定用户
  deleteUser = async user => {
    Modal.confirm({
      title: `确认删除${user.username}用户吗？`,
      onOk: async () => {
        const userID = user._id;
        const res = await reqDeleteUser(userID);
        if (res.status === 0) {
          message.success(`删除用户${user.username}成功`);
          this.getUserList();
        } else {
          message.error(`删除用户${user.username}失败`);
        }
      },
      onCancel() {
        message.warning("已经取消删除！");
      },
    });
  };
  //确认创建用户
  addUser = () => {
    this.AddForm.current.validateFields().then(async user => {
      const res = await reqAddUser(user);
      if (res.status === 0) {
        message.success("添加用户成功");
        this.getUserList();
      } else {
        message.error("此用户已经存在");
      }

      this.AddForm.current.resetFields();
      this.setState({ createStatus: false });
    });
  };
  //显示更新用户的模态框
  showUpdateUser = user => {
    this.user = user;
    this.setState({ UpdateStatus: true });
  };
  // 确认更新用户
  updateUser = () => {
    const { _id } = this.user;
    this.updateForm.current.validateFields().then(async values => {
      const user = { _id, ...values };
      const res = await reqUpdateUser(user);
      if (res.status === 0) {
        message.success("更新用户成功!");
        this.getUserList();
      } else {
        message.error("更新用户失败!");
      }
      this.setState({ UpdateStatus: false });
    });
  };
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUserList();
  }
  render() {
    const { userList, createStatus, UpdateStatus, roles } = this.state;
    const user = this.user || {};
    const title = (
      <Button
        type='primary'
        onClick={() => this.setState({ createStatus: true })}
      >
        创建用户
      </Button>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          columns={this.columns}
          rowKey='_id'
          dataSource={userList}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            showSizeChanger: false,
          }}
        ></Table>
        <Modal
          title='添加用户'
          visible={createStatus}
          onOk={this.addUser}
          onCancel={() => {
            this.AddForm.current.resetFields();
            this.setState({ createStatus: false });
          }}
        >
          <AddForm
            setAddForm={AddForm => (this.AddForm = AddForm)}
            roles={roles}
          />
        </Modal>
        <Modal
          title='修改用户'
          visible={UpdateStatus}
          onOk={this.updateUser}
          onCancel={() => {
            message.warning("取消更新用户!");
            this.setState({ UpdateStatus: false });
          }}
        >
          <UpdateForm
            setUpdateForm={updateForm => (this.updateForm = updateForm)}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    );
  }
}
