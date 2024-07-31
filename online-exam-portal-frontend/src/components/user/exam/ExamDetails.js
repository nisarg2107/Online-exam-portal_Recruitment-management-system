import { Button, Layout, theme } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ExamDetails = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [loggedInUser, setLoggedInUser] = useState({});

  const { studentId, examId } = useParams();
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState(window.innerWidth);

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

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          margin: "24px 16px",
          height: "80vh",
          maxHeight: "80vh",
        }}>
        <div
          style={{
            padding: 24,
            // minHeight: 360,
            maxHeight: "80vh",
            height: "80vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          <p>This exam will contain different type of questions</p>
          <p>Dont switch tabs</p>
          <p>Dont try to use back button </p>
          <p>
            You will only get one chance to appear for the exam and if problem
            happens with you during the submission, contact the examiner and
            raise your concern{" "}
          </p>
          <p>Clicking on the start button will start the exam</p>
          <p>
            Note: Once the exam is started you cannot leave and leaving from the
            website will automatically submit the exam
          </p>
          <Button
            danger
            onClick={() => {
              navigate(`/student/${studentId}/exam/${examId}`);
            }}>
            Start
          </Button>
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

export default ExamDetails;
