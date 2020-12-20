import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { Menu, Switch, Button, Modal, Input, Layout } from "antd";
import { EditTwoTone, FileTwoTone  } from "@ant-design/icons";

import NewTicket from "./ticket/NewTicket";

import { baseUrl } from "../utils";

const Navigation = () => {
  const history = useHistory();
  const { SubMenu } = Menu;
  const { Header, Content, Footer, Sider } = Layout;

  const [checkAdmin, setCheckAdmin] = useState(false);
  const [current, setCurrent] = useState();
  const [isDark, setIsDark] = useState("light");

  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");

  const onCancel = () => {
    setVisible(false);
  };

  function logout() {
    localStorage.clear();
    history.push("/login");
  }

  const changeTheme = (value) => {
    setIsDark(value ? "dark" : "light");
  };

  const handleClick = (e) => {
    //console.log('click ', e);
    setCurrent(e.key);
  };

  function isAdmin() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setCheckAdmin(true);
    } else {
      if (!user) {
        history.push("/Login");
      }
    }
  }

  useEffect(() => {
    isAdmin();
  }, []);

  const resetPassword = async () => {
    await fetch(`${baseUrl}/api/v1/auth/resetPassword/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        password,
      }),
    }).then((res) => res.json);
  };

  const Render = () => {
    if (checkAdmin) {
      return (
        <div>
          <Layout>
            <Menu
              mode="horizontal"
              onClick={handleClick}
              defaultSelectedKeys={["0"]}
              selectedKeys={current}
            >
              <Menu.Item key="Home Page">
                <a
                  href="https://pmint.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Peppermint 🍵
                </a>
              </Menu.Item>
              <Menu.Item key={0} onClick={() => history.push("/")}>
                Home
              </Menu.Item>
              <SubMenu key="SubMenu" icon={<FileTwoTone />} title="Tickets">
                  <Menu.Item key="tickets:1"><Link to='/ticket/open'>Open Tickets</Link></Menu.Item>
                  <Menu.Item key="tickets:2"><Link to='/ticket/unissued'>Unissued Tickets</Link></Menu.Item>
              </SubMenu>
              <Menu.Item key={3} onClick={() => history.push("/history")}>
                History
              </Menu.Item>
              <Menu.Item
                key={6}
                onClick={() => history.push("/admin/dashboard")}
              >
                Admin
              </Menu.Item>
              <Menu.Item
                key={5}
                style={{ float: "right" }}
                onClick={() => {
                  setVisible(true);
                }}
              >
                Settings
                <Modal
                  keyboard={true}
                  visible={visible}
                  mask={true}
                  title="Settings"
                  okText="Exit"
                  onOk={onCancel}
                  onCancel={onCancel}
                >
                  <Input
                    placeholder="Enter new Password ... "
                    style={{ width: 200 }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <Button
                    onClick={resetPassword}
                    style={{ marginLeft: 10, margin: 5 }}
                  >
                    <EditTwoTone />
                  </Button>
                  <Button onClick={logout}>Logout</Button>
                </Modal>
              </Menu.Item>
              <Menu.Item key={4} style={{ float: "right" }} title="New Ticket">
                <NewTicket />
              </Menu.Item>
            </Menu>
          </Layout>
        </div>
      );
    } else {
      return (
        <div>
          <Menu
            mode="horizontal"
            onClick={handleClick}
            selectedKeys={[current]}
          >
            <Menu.Item disabled={true}>Project Winter</Menu.Item>
            <Menu.Item key={0} onClick={() => history.push("/")}>
              Home
            </Menu.Item>
            <SubMenu key="SubMenu" icon={<FileTwoTone />} title="Tickets">
                  <Menu.Item key="tickets:1"><Link to='/ticket/open'>Open Tickets</Link></Menu.Item>
                  <Menu.Item key="tickets:2"><Link to='/ticket/unissued'>Unissued Tickets</Link></Menu.Item>
              </SubMenu>
            <Menu.Item key={3} onClick={() => history.push("/history")}>
              History
            </Menu.Item>
            <Menu.Item
              key={5}
              style={{ float: "right" }}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              key={4}
              style={{ float: "right" }}
            >
              <NewTicket />
            </Menu.Item>
            <Switch
              style={{ float: "right", marginTop: 15 }}
              checked={isDark === "dark"}
              onChange={changeTheme}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </Menu>
        </div>
      );
    }
  };

  return (
    <div>
      <Render />
    </div>
  );
};

export default Navigation;
