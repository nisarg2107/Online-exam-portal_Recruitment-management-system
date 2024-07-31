import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./dashboard.scss";
import ViewExam from "../exams/ViewExamQuestions";
import Exams from "../exams";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "exams",
    icon: React.createElement(UploadOutlined),
    label: "Exams",
    children: [
      {
        label: "Add Exam",
        key: "/dashboard/exams/add",
        icon: React.createElement(VideoCameraOutlined),
      },
      {
        label: "View Exams",
        key: "/dashboard/exams/view",
        icon: React.createElement(VideoCameraOutlined),
      },
    ],
  },
  {
    key: "roles",
    icon: React.createElement(VideoCameraOutlined),
    label: "Roles",
    children: [
      {
        label: "Add Role",
        key: "/dashboard/roles/add",
        icon: React.createElement(VideoCameraOutlined),
      },
      {
        label: "View Roles",
        key: "/dashboard/roles/view",
        icon: React.createElement(VideoCameraOutlined),
      },
    ],
  },
  {
    key: "users",
    icon: React.createElement(UserOutlined),
    label: "Users",
    children: [
      {
        label: "Add User",
        key: "/dashboard/users/add",
        icon: React.createElement(VideoCameraOutlined),
      },
      {
        label: "View Users",
        key: "/dashboard/users/view",
        icon: React.createElement(VideoCameraOutlined),
      },
    ],
  },
  {
    key: "questions",
    icon: React.createElement(VideoCameraOutlined),
    label: "Questions",
    children: [
      {
        label: "Add Question",
        key: "/dashboard/questions/add",
        icon: React.createElement(VideoCameraOutlined),
      },
      {
        label: "View Questions",
        key: "/dashboard/questions/view",
        icon: React.createElement(VideoCameraOutlined),
      },
    ],
  },
  {
    key: "categories",
    icon: React.createElement(UploadOutlined),
    label: "Categories",
    children: [
      {
        label: "Add Category",
        key: "/dashboard/categories/add",
        icon: React.createElement(VideoCameraOutlined),
      },
      {
        label: "View Categories",
        key: "/dashboard/categories/view",
        icon: React.createElement(VideoCameraOutlined),
      },
    ],
  },
  {
    key: "difficulty",
    icon: React.createElement(UserOutlined),
    label: "Difficulty",
    children: [
      {
        label: "Add Difficulty",
        key: "/dashboard/difficulty/add",
        icon: React.createElement(VideoCameraOutlined),
      },
      {
        label: "View Difficulty",
        key: "/dashboard/difficulty/view",
        icon: React.createElement(VideoCameraOutlined),
      },
    ],
  },
];
function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(
    location?.pathname ? location.pathname : "/exams/view"
  );

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (
      jwtToken === null ||
      jwtToken === undefined ||
      !userData?.role.includes("ADMIN")
    ) {
      console.log("called here:::::");
      window.location.replace("http://localhost:3000/login");
    }

    const { token } = JSON.parse(jwtToken);

    if (window.location.href.includes === "http://localhost:3000/dashboard") {
      window.location.replace("http://localhost:3000/dashboard/users/view");
    }

    if (location.pathname === "/") {
      window.location.replace("http://localhost:3000/dashboard/users/view");
    }
    navigate(location.pathname);
  }, []);

  useEffect(() => {}, [location.pathname]);

  const [lightTheme, setLightTheme] = useState(false);

  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme={lightTheme ? "light" : "dark"}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken, width) => {
          console.log(width, "breakpoint ??", broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log("is called on close??");

          console.log(collapsed, type);
        }}
        className="sidebar"
        // style={{ height: '100vh', position: 'absolute', zIndex: '1' }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme={lightTheme ? "light" : "dark"}
          mode="inline"
          defaultSelectedKeys={[selectedKeys]}
          onClick={(item) => {
            console.log(item);
            navigate(item.key);
          }}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          className="header"
          style={{ padding: 0, background: colorBgContainer }}>
          <div>
            Admin Panel
            <Button
              type="primary"
              onClick={() => {
                localStorage.removeItem("jwtToken");
                localStorage.removeItem("userData");
                window.location.replace("http://localhost:3000/login");
              }}>
              {" "}
              Logout{" "}
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            maxHeight: "80%",
          }}>
          <div
            style={{
              padding: 24,
              // minHeight: 360,
              // maxHeight: 800,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
            {/* <Exams /> */}
            <Outlet />
          </div>
        </Content>
        <Footer
          className="footer"
          style={{ textAlign: "center", background: colorBgContainer }}>
          Roime Intelligence ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
export default Dashboard;
