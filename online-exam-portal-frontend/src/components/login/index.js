import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Input, Space, Spin, message } from "antd";
import { jwtLogin } from "../../features/authDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../../utils";
//import "./login.css";

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 12 },
    lg: { span: 8 },
  },
};
const tailLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8, offset: 8 },
    md: { span: 12, offset: 8 },
    lg: { span: 12, offset: 8 },
  },
};

const Login = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading: credLoading } = useSelector((state) => state.jwt);
  const [loading, setLoading] = useState(credLoading);

  const [messageApi, contextHolder] = message.useMessage();
  const successPopup = () => {
    messageApi.open({
      type: "success",
      content: "This is a success message",
      duration: 1,
    });
  };
  const errorPopup = (errorMessage) => {
    messageApi.open({
      type: "error",
      content: errorMessage,
      duration: 1,
    });
  };

  useEffect(() => {
    checkLogin().then((response) => {
      if (response === true) {
        const userData = JSON.parse(localStorage.getItem("userData"));
        console.log("userData in login::::", userData);
        if (
          userData !== null &&
          userData !== undefined &&
          userData.role.includes("ADMIN")
        ) {
          navigate("/dashboard/users/view");
        } else if (
          userData !== null &&
          userData !== undefined &&
          userData.role.includes("USER")
        ) {
          navigate("/userdashboard");
        }
      }
    });

    setLoading(credLoading);
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
    localStorage.clear();
    setLoading(true);
    setTimeout(() => {
      dispatch(jwtLogin(values)).then((response) => {
        console.log("response in login jwt", response);
        localStorage.setItem("jwtToken", JSON.stringify(response.payload));
        if (response.type.includes("fulfilled")) {
          form.resetFields();
          successPopup();

          console.log("loign ::::: response", response);
          checkLogin().then((response) => {
            console.log("after:::: response::::::", response);
            const userData = JSON.parse(localStorage.getItem("userData"));
            console.log("check login login page user data", userData);
            if (response === true) {
              const userData = JSON.parse(localStorage.getItem("userData"));
              console.log("userData in login::::", userData);
              if (
                userData !== null &&
                userData !== undefined &&
                userData.role.includes("ADMIN")
              ) {
                navigate("/dashboard/users/view");
              } else if (
                userData !== null &&
                userData !== undefined &&
                userData.role.includes("USER")
              ) {
                navigate("/userdashboard");
              }
            } else {
              console.log("response false", response);
              localStorage.clear();
            }
          });
          // localStorage.setItem('jwtToken', { ...response.payload })
          // console.log(response)
          // window.location.replace('http://localhost:3000/dashboard')
        } else {
          errorPopup(response?.payload?.message);
          localStorage.clear();
        }
        console.log("response", response);
        setLoading(false);
        //localStorage.clear();
      });
    }, 1000);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <Form
          {...layout}
          form={form}
          name="basic"
          style={{
            // maxWidth: "60%",
            margin: "20px auto",
          }}
          // layout="vertical"

          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Form.Item
            label="Username"
            name="username"
            // labelPosition="top"
            rules={[
              {
                required: true,
                whitespace: true,
                type: "email",
                message: "Please input valid email!",
              },
            ]}>
            <Input placeholder="test@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            // labelPosition="top"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}>
            <Input.Password placeholder="********" />
          </Form.Item>

          <Form.Item
            {...tailLayout}
            // style={{
            //     // maxWidth: "60%",
            //     display: 'flex',
            //     justifyContent: 'center'

            // }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};
export default Login;
