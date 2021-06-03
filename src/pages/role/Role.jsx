import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { reqAddRoles, reqRoles, reqUpdateRole } from "../../api";
import { PAGE_SIZE } from "../../utils/constans";
import memoryUtils from "../../utils/memoryUtils";
import { removeUser } from "../../utils/storageUtils";
import { formateDate } from "../../utils/dateUtils";
import AddRole from "./childComps/AddRole";
import AuthForm from "./childComps/AuthForm";
/**
 * 角色路由
 */
export default class Role extends Component {
  //状态
  state = {
    roles: [],
    role: {},
    addStatus: false,
    updateStatus: false,
  };
  auth = React.createRef();
  //初始化列数据
  initColumns = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };
  //点击单行时的事件回调
  onRow = role => {
    return {
      onClick: event => {
        this.setState({ role });
      },
    };
  };
  //获取角色列表
  getRoleList = async () => {
    const res = await reqRoles();
    if (res.status === 0) {
      const roles = res.data;
      this.setState({ roles });
    }
  };
  //角色添加完成
  addRole = () => {
    this.form.current.validateFields().then(async values => {
      const { roleName } = values;
      this.form.current.resetFields();
      const res = await reqAddRoles(roleName);
      if (res.status === 0) {
        this.setState(state => ({ roles: [...state.roles, res.data] }));
        message.success("添加角色成功");
      } else {
        message.error("添加角色失败");
      }

      this.setState({ addStatus: false });
    });
  };
  //取消添加角色
  cancelAddRole = () => {
    this.form.current.resetFields();
    this.setState({ addStatus: false });
  };

  //更新角色权限
  updateRole = async () => {
    const role = this.state.role;
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_name = memoryUtils.user.username;
    const res = await reqUpdateRole(role);
    if (res.status === 0) {
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {};
        removeUser();
        this.props.history.replace("/login");
        message.warning("当前角色权限发生修改,请重新登录!");
      } else {
        this.getRoleList();
        message.success("更新角色权限成功!");
      }
    } else {
      message.error("更新角色权限失败!");
    }
    this.setState({
      updateStatus: false,
    });
  };
  //取消更新角色权限
  cancelUpdateRole = () => {
    this.setState({
      updateStatus: false,
    });
  };

  //初始化列数据
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  //组件挂载时的生命周期
  componentDidMount() {
    this.getRoleList();
  }
  render() {
    const { roles, role, addStatus, updateStatus } = this.state;
    const title = (
      <span>
        <Button
          type='primary'
          style={{ marginRight: 10 }}
          onClick={() => {
            this.setState({ addStatus: true });
          }}
        >
          创建角色
        </Button>
        <Button
          type='primary'
          disabled={!role._id}
          onClick={() => this.setState({ updateStatus: true })}
        >
          设置角色权限
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            showSizeChanger: false,
          }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: role => this.setState({ role }),
          }}
          onRow={this.onRow}
        />
        <Modal
          title='添加角色'
          visible={addStatus}
          onOk={this.addRole}
          onCancel={this.cancelAddRole}
        >
          <AddRole setForm={form => (this.form = form)} />
        </Modal>

        <Modal
          title='设置角色权限'
          visible={updateStatus}
          onOk={this.updateRole}
          onCancel={this.cancelUpdateRole}
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    );
  }
}
