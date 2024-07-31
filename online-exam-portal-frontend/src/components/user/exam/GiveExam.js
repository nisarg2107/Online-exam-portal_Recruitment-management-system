import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Col,
  Flex,
  Input,
  List,
  Modal,
  Pagination,
  Popconfirm,
  Radio,
  Row,
  Space,
  Statistic,
  notification,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Layout, Menu, theme } from "antd";
import NotFound from "../../NotFound";
import { checkLogin } from "../../../utils";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { fetchExamByid } from "../../../features/examDetailSlice";
import { useDispatch } from "react-redux";
import {
  createExamQuestionResponse,
  fetchSingleExamQuestionResponse,
} from "../../../features/examQuestionResponseDetailSlice";
import TextArea from "antd/es/input/TextArea";
import { updateUserExam } from "../../../features/userExamDetailSlice";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import "./give-exam.scss";

const { Countdown } = Statistic;

const GiveExam = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.success({
      message: `Submitted successfully`,
      description: "Your exam is submitted successfully!!!",
      placement: "bottomRight",
    });
  };

  const [examQuestion, setExamQuestion] = useState([]);
  // const [answer, setAnswer] = useState()
  const [userResponseList, setUserResponseList] = useState([]);
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(1.0);
  const location = useLocation();
  const [viewExam, setViewExam] = useState(false);
  const [userExamDetails, setUserExamDetails] = useState({});
  const [firstDefault, setFirstDefault] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handle = useFullScreenHandle();
  const [isFullScreen, setFullScreen] = useState(true);

  const reportChange = useCallback((state, handle) => {
    console.log("full screeen", state, "handle", handle);
    if (state === true) {
      setFullScreen(true);
    } else if (state === false) {
      setFullScreen(false);
    }
  });

  const navigate = useNavigate();

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/userdashboard");
  };

  const { studentId, examId } = useParams();
  // console.log('student id', typeof studentId, 'exam id', examId)

  const { id } = JSON.parse(localStorage.getItem("userData"));
  const [counter, setCounter] = useState(0);

  const layoutRef = useRef(null);

  const enterFullscreen = (elem) => {
    // const elem = layoutRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    console.log("is this called for exit");
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari, and Opera
      document.webkitExitFullscreen();
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      console.log("trying to exit???");
      exitFullscreen();
    }
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (jwtToken === null || jwtToken === undefined) {
      window.location.replace("http://localhost:3000/login");
    }
    const { token } = JSON.parse(jwtToken);
    let quesSet = [];
    // console.log('token:::::', token)
    // console.log('give exam::::::::: path name', location)
    // handleFullscreen()
    // const examLayout = document.getElementById("exam-layout");
    // if (!document.fullscreenElement) {
    //     enterFullscreen(examLayout)
    // }
    dispatch(fetchExamByid({ id: parseInt(examId), token: token })).then(
      (response) => {
        // console.log('just responese........', response)

        // console.log('exam question set response::::::', response.payload.examQuestionSet)
        setExamQuestion(response.payload.examQuestionSet);
        const duration = response.payload.duration;
        const remaining = duration - Math.floor(duration);
        const minutes = 60 * remaining;
        // console.log("Minutes : " + Math.round(minutes) + "\tHours : " + Math.floor(duration));
        setDuration(
          Date.now() +
            (1000 * 60 * 60 * Math.floor(duration) + 60 * minutes * 1000)
        );
        // setDuration(Date.now() + 1000 * 5)
        // console.log('duration', 1000 * 60 * 60)
        const currUserExamDetails = response.payload.studentExamSet.filter(
          (element) =>
            element.exam.id === parseInt(examId) &&
            element.user.id === parseInt(id)
        );
        // console.log('currUserExamDetails::::::::::::::::', currUserExamDetails)
        quesSet = response.payload.examQuestionSet;
        if (currUserExamDetails.length > 0) {
          // console.log('did this come here ????', currUserExamDetails[0])
          setUserExamDetails(currUserExamDetails[0]);
          if (
            currUserExamDetails[0]?.submitted === true &&
            currUserExamDetails[0]?.status.toLowerCase() === "success"
          ) {
            setViewExam(true);
            // console.log('inside if view exam::::::::::::::')
            setDuration(0.0);
          }

          if (
            currUserExamDetails[0]?.submitted === true &&
            currUserExamDetails[0]?.status.toLowerCase() === "pending"
          ) {
            setIsModalOpen(true);
            // console.log('inside if modal::::::::::::::', isModalOpen)
            setDuration(0.0);
            setViewExam(true);
          }
        }

        dispatch(
          fetchSingleExamQuestionResponse({
            examId: parseInt(examId),
            studentId: parseInt(id),
            token,
          })
        ).then((response) => {
          // console.log('fetchSingleExamQuestionResponse :::::::::', response)
          const previousUserResponse = response.payload.map((element) => {
            return {
              id: element.questionId,
              value:
                element.mcq === true && element.selectedOptionId > 0
                  ? element.selectedOptionId
                  : element.answer === null || element.answer === undefined
                  ? ""
                  : element.answer,
            };
          });

          console.log(
            "b4 response list::::::::::::::::::::: ",
            previousUserResponse
          );
          setUserResponseList(previousUserResponse);

          if (previousUserResponse.length > 0) {
            const current = previousUserResponse.filter(
              (element) => element.id === quesSet[0]?.question?.id
            );
            console.log("current:::::::", current[0].value);
            setFirstDefault(
              current.length > 0 &&
                current[0].value !== null &&
                current[0]?.value !== undefined
                ? current[0]?.value
                : ""
            );
            console.log(
              "first default:::::::::",
              current.length > 0 &&
                current[0]?.value !== null &&
                current[0]?.value !== undefined
                ? current[0].value
                : "test"
            );
          }
        });
      }
    );
  }, []);

  useEffect(() => {
    console.log("is this called ???");
  }, [firstDefault, userResponseList]);

  const onFinish = () => {
    console.log("timer finished");
    if (viewExam === false) {
      handleSubmit();
    }
  };

  const onChange = (e) => {
    const id = examQuestion[counter]?.question?.id;
    // console.log('text and radio', e.target.value);

    const userResponse = userResponseList.filter(
      (element) => element.id !== id
    );
    userResponse.push({ id, value: e.target.value });

    // console.log('user response list:::::::::', userResponse)
    if (counter === 0) {
      setFirstDefault(e.target.value);
    }
    setUserResponseList(userResponse);
  };

  useEffect(() => {
    // console.log('user response list::::::', userResponseList)
  }, [counter, userResponseList]);

  const saveDB = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (jwtToken === null || jwtToken === undefined) {
      window.location.replace("http://localhost:3000/login");
    }
    const { token } = JSON.parse(jwtToken);
    // console.log('currr', examQuestion[counter])
    const questionId = examQuestion[counter]?.question?.id;
    const beforeValue = userResponseList.filter(
      (element) => element.id === questionId
    );
    console.log("beforeValue::::::", beforeValue);

    const current = userResponseList.filter(
      (element) => element.id === examQuestion[counter]?.question?.id
    );

    // if (counter === 0) {
    //     setFirstDefault(current.length > 0 && current[0].value !== null && current[0].value !== undefined ? current[0].value : '')
    // }

    if (beforeValue.length > 0 && viewExam === false) {
      // console.log('not called right...')
      dispatch(
        createExamQuestionResponse({
          token,
          studentId: parseInt(id),
          questionId: questionId,
          examId: parseInt(examId),
          mcq:
            examQuestion[counter].question.mcq &&
            examQuestion[counter].question.optionSet.length > 1
              ? true
              : false,
          value:
            beforeValue.length > 0
              ? beforeValue[0].value
              : examQuestion[counter].question.mcq &&
                examQuestion[counter].question.optionSet.length > 1
              ? 0
              : "",
        })
      );
    }
  };

  const isAttemptedBefore = () => {
    // console.log('currr', examQuestion[counter])
    const questionId = examQuestion[counter]?.question?.id;
    const beforeValue = userResponseList.filter(
      (element) => element.id === questionId
    );

    if (beforeValue.length > 0) {
      return true;
    }

    return false;
  };

  const handleNext = () => {
    saveDB();

    if (counter < examQuestion.length - 1) {
      setCounter(counter + 1);
    }
  };

  const handlePrev = () => {
    saveDB();

    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  const handleSubmit = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (jwtToken === null || jwtToken === undefined) {
      window.location.replace("http://localhost:3000/login");
    }
    const { token } = JSON.parse(jwtToken);

    const questionId = examQuestion[counter]?.question?.id;
    const beforeValue = userResponseList.filter(
      (element) => element.id === questionId
    );

    dispatch(
      createExamQuestionResponse({
        token,
        studentId: parseInt(id),
        questionId: questionId,
        examId: parseInt(examId),
        mcq:
          examQuestion[counter].question.mcq &&
          examQuestion[counter].question.optionSet.length > 1
            ? true
            : false,
        value:
          beforeValue.length > 0
            ? beforeValue[0].value
            : examQuestion[counter].question.mcq &&
              examQuestion[counter].question.optionSet.length > 1
            ? 0
            : "",
      })
    ).then(() => {
      dispatch(
        updateUserExam({
          token,
          studentId: parseInt(id),
          examId: parseInt(examId),
        })
      ).then(() => {
        openNotification();
        setTimeout(() => {
          window.location.replace("http://localhost:3000/");
        }, 1000);
      });
    });
  };

  const handleDefault = () => {
    const current = userResponseList.filter(
      (element) => element.id === examQuestion[counter]?.question?.id
    );

    // console.log('exam id', examQuestion[counter]?.question?.id)
    console.log("user response list", userResponseList);
    console.log(counter, "current default", current);
    console.log("first default in handle default", firstDefault);
    if (counter === 0) {
      console.log(
        "inside if handle default",
        current.length > 0 &&
          current[0]?.value !== null &&
          current[0]?.value !== undefined
          ? current[0]?.value
          : ""
      );
      setFirstDefault(
        current.length > 0 &&
          current[0]?.value !== null &&
          current[0]?.value !== undefined
          ? current[0]?.value
          : ""
      );
      return firstDefault;
    }
    return current.length > 0 &&
      current[0].value !== null &&
      current[0].value !== undefined
      ? current[0].value
      : "";
  };

  if (!checkLogin() || id != studentId) {
    return <NotFound />;
  }

  if (
    viewExam === true &&
    userExamDetails?.submitted === true &&
    userExamDetails?.status.toLowerCase() === "pending"
  ) {
    console.log("modal in if", isModalOpen);
    return (
      <>
        <Modal
          cancelButtonProps={{ style: { display: "none" } }}
          title="Result pending"
          open={isModalOpen}
          onOk={handleOk}
          closeIcon={false}>
          <p>Your result is getting checked, please wait for a while</p>
          <p>We will contact you once it is checked...</p>
        </Modal>
      </>
    );
  }

  return (
    // <FullScreen
    //     onChange={reportChange}
    //     handle={handle}
    // // isFullScreen={isFullScreen}
    // // enabled={isFullscreen}

    // >
    <>
      {/* <button onClick={(e) => setFullScreen(true)}>Go Fullscreen</button> */}

      {contextHolder}

      <Layout id="exam-layout" ref={layoutRef} style={{ minHeight: "100vh" }}>
        <Header
          className="header"
          style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Roima exam portal</span>

            {viewExam === false && (
              <>
                <Countdown
                  title="Time Left"
                  value={duration}
                  onFinish={onFinish}
                />
                <Popconfirm
                  title="Sure to submit the exam?"
                  onConfirm={handleSubmit}>
                  <Button>Submit</Button>
                </Popconfirm>
              </>
            )}
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            // maxHeight: '80%'
            padding: 24,
            // minHeight: 360,
            // maxHeight: 800,
            height: "73vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          <Row>
            <Col span={16}>
              <div>
                {counter + 1}
                {examQuestion[counter]?.question?.mcq &&
                examQuestion[counter]?.question?.optionSet.length > 1 ? (
                  <div style={{ height: "58vh" }}>
                    <p>id: {examQuestion[counter]?.question?.id}</p>

                    <p className="title">
                      Title: {examQuestion[counter]?.question?.title}
                    </p>
                    <p className="description">
                      Description:{" "}
                      {examQuestion[counter]?.question?.description}
                    </p>

                    <Radio.Group
                      onChange={onChange}
                      key={examQuestion[counter]?.question?.id}
                      // defaultValue={userResponseList.filter(element => element.id === examQuestion[counter]?.question?.id).value}
                      value={counter === 0 ? firstDefault : handleDefault()}
                      disabled={viewExam}>
                      <Space direction="vertical">
                        {examQuestion[counter].question.optionSet.map(
                          (option) => (
                            <Radio
                              value={option?.id}
                              key={option?.id}
                              className={
                                viewExam === true && option?.correct === true
                                  ? "correct-option"
                                  : ""
                              }>
                              id {option?.id} - {option?.name}
                            </Radio>
                          )
                        )}
                      </Space>
                    </Radio.Group>
                  </div>
                ) : (
                  <div>
                    <p>id: {examQuestion[counter]?.question?.id}</p>
                    <p className="title">
                      Title: {examQuestion[counter]?.question?.title}
                    </p>
                    <p className="description">
                      Description:{" "}
                      {examQuestion[counter]?.question?.description}
                    </p>
                    <TextArea
                      placeholder="textarea with clear icon"
                      autoSize={{
                        minRows: 13,
                        // maxRows: 13,
                      }}
                      style={{ maxHeight: "100%" }}
                      // defaultValue={handleDefault}
                      value={counter === 0 ? firstDefault : handleDefault()}
                      // onLoad={handleDefault}
                      // value={handleDefault()}

                      disabled={viewExam === true ? true : false}
                      key={examQuestion[counter]?.question?.id}
                      allowClear
                      onChange={onChange}
                    />
                  </div>
                )}
              </div>
              <div>
                <Button disabled={counter === 0} onClick={handlePrev}>
                  Prev
                </Button>
                <Button
                  disabled={counter === examQuestion.length - 1}
                  onClick={handleNext}>
                  Next
                </Button>
                {/* <Popconfirm title="Sure to submit the exam?" onConfirm={handleSubmit}>
                                        <Button>Submit</Button>
                                    </Popconfirm> */}
              </div>
            </Col>
            <Col
              span={8}
              style={{
                alignSelf: "center",
              }}>
              <div
                style={{
                  marginLeft: "2%",
                }}>
                {examQuestion.map((element, index) => (
                  <>
                    <Button
                      onClick={() => {
                        saveDB();
                        setCounter(index);
                      }}
                      style={{
                        marginLeft: "8%",
                        marginRight: "2%",
                        marginBottom: "5%",
                      }}
                      // (isAttemptedBefore() === true ? 'attempted' : 'not-attempted')
                      className={
                        counter === index
                          ? "current-btn"
                          : userResponseList.filter(
                              (res) => res.id == element.question.id
                            ).length
                          ? "attempted"
                          : "not-attempted"
                      }
                      shape="circle">
                      {index + 1}
                    </Button>
                  </>
                ))}
              </div>
            </Col>
          </Row>
        </Content>
        <Footer
          className="footer"
          style={{ textAlign: "center", background: colorBgContainer }}>
          Nisarg Desai ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </>
    // </FullScreen>
  );
};
export default GiveExam;

// may be useful for full
// https://stackoverflow.com/questions/37440408/how-to-detect-esc-key-press-in-react-and-how-to-handle-it
// https://levelup.gitconnected.com/how-to-implement-full-screen-functionality-in-react-%EF%B8%8F-1281803130f4
