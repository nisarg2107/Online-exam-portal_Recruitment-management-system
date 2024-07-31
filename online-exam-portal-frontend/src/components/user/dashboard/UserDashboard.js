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
import AllUserExams from "../exams/AllUserExams";
import { fetchUserExams } from "../../../features/userExamDetailSlice";
import { useDispatch, useSelector } from "react-redux";

const { Header, Content, Footer } = Layout;

const UserDashboard = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const [loggedInUser, setLoggedInUser] = useState({});

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch();

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    // console.log("window size", windowSize)

    const jwtToken = localStorage.getItem("jwtToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (jwtToken === null || jwtToken === undefined) {
      window.location.replace("http://localhost:3000/login");
    }
    const { token } = JSON.parse(jwtToken);

    setLoggedInUser({ ...userData });

    // const { token } = JSON.parse(jwtToken);
    // const { id } = JSON.parse(localStorage.getItem('userData'));
    // dispatch(fetchUserExams({ token, id }))
    // console.log("userDashboard::::::::::")

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const { userExam, loading } = useSelector((state) => state.userExam);

  useEffect(() => {
    // console.log('user exam changed:::::::::::', userExam)
  }, [loggedInUser]);

  // useEffect(() => {
  //     first

  //     return () => {
  //         second
  //     }
  // }, [third])

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="header"
        style={{ padding: 0, background: colorBgContainer }}>
        <div>
          {/* <div> */}
          Welcome {loggedInUser.name}
          {/* </div> */}
          <Button
            type="primary"
            onClick={() => {
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("role");
              localStorage.removeItem("userData");
              window.location.replace("http://localhost:3000/");
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
            maxHeight: "73vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          {/* <Exams /> */}
          <AllUserExams />
        </div>
      </Content>
      <Footer
        className="footer"
        style={{
          textAlign: "center",
          position: "relative",
          background: colorBgContainer,
        }}>
        Nisarg Desai ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default UserDashboard;
