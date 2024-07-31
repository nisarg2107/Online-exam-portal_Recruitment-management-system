import React, { useEffect, useState } from "react";
import { Input, List, Pagination, Popconfirm, Radio, Space } from "antd";
import { useParams } from "react-router-dom";
import { Button, Layout, Menu, theme } from "antd";
import NotFound from "../../NotFound";
import { checkLogin } from "../../../utils";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { fetchExamByid } from "../../../features/examDetailSlice";
import { useDispatch } from "react-redux";
import ViewMCQ from "./ViewMCQ";
import ViewNotMCQ from "./ViewNotMCQ";
import {
  createExamQuestionResponse,
  fetchSingleExamQuestionResponse,
} from "../../../features/examQuestionResponseDetailSlice";
import TextArea from "antd/es/input/TextArea";
import { updateUserExam } from "../../../features/userExamDetailSlice";

const GiveExam = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // const pagination = {
  //     current: 1,
  //     pageSize: examQuestion.length,
  // }

  // const [tableParams, setTableParams] = useState({
  //     pagination: {
  //         current: 1,
  //         pageSize: 1,
  //         total: 1
  //     },
  // });

  const [questionResponse, setQuestionResponse] = useState({});
  const [examQuestion, setExamQuestion] = useState([]);
  const [singleQuestion, setSingleQuestion] = useState({});
  const [answer, setAnswer] = useState();

  const [userResponseList, setUserResponseList] = useState([]);

  const [submittedAnswer, setSubmittedAnswer] = useState();

  const [isStudentEligible, setIsStudentEligible] = useState(false);
  const dispatch = useDispatch();

  const { studentId, examId } = useParams();
  // console.log('student id', typeof studentId, 'exam id', examId)

  const { id } = JSON.parse(localStorage.getItem("userData"));
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken === null || jwtToken === undefined) {
      window.location.replace("http://localhost:3000/");
    }
    const { token } = JSON.parse(jwtToken);
    // console.log('token:::::', token)
    dispatch(fetchExamByid({ id: parseInt(examId), token: token })).then(
      (response) => {
        console.log(
          "exam set response::::::",
          response.payload.examQuestionSet
        );
        setExamQuestion(response.payload.examQuestionSet);
        setSingleQuestion(response.payload.examQuestionSet[0]);
        // setTableParams({ ...tableParams.pagination, 'total': response.payload.examQuestionSet.length })
        // dispatch(fetchSingleExamQuestionResponse({ token, 'studentId': parseInt(studentId), 'examId': parseInt(examId), 'questionId': parseInt(response.payload.examQuestionSet[0].question.id) }))
        //     .then((response) => {
        //         console.log("fetched single response", response)
        //         setSubmittedAnswer(response.payload)
        //     })
      }
    );
  }, []);

  // console.log('single question', singleQuestion)

  // const handleChange = (value) => {
  //     // console.log(examQuestion, 'pagination value', value)
  //     // console.log('pagination', pagination)
  //     // console.log('handle change::::::', tableParams)
  //     console.log('question response', questionResponse)
  //     // setQuestionResponse(new Set([...questionResponse, { ...answer }]));

  //     const jwtToken = localStorage.getItem('jwtToken');
  //     const { token } = JSON.parse(jwtToken);
  //     // dispatch(createExamQuestionResponse({ ...questionResponse, token }))

  //     setTableParams({
  //         ...tableParams,
  //         'current': value
  //     });
  // };

  // const handleAnswer = (questionId, value, mcq) => {
  //     // console.log(questionId, 'value in parent::::::', value)
  //     setQuestionResponse({ 'studentId': parseInt(studentId), 'examId': parseInt(examId), questionId, value, mcq })
  // }

  // useEffect(() => {
  //     // console.log('question response in parent::::::::', questionResponse)

  // }, [questionResponse]);

  // useEffect(() => {
  //     // setSingleQuestion(examQuestion[value - 1])
  //     // console.log('table params', tableParams)
  //     // console.log('question response', questionResponse)
  //     setSingleQuestion(examQuestion[tableParams.current - 1])

  // }, [JSON.stringify(tableParams)]);

  const onChange = (e) => {
    const id = singleQuestion?.question?.id;
    setAnswer({ id, value: e.target.value });
    console.log("text and radio", e.target.value);

    const userResponse = userResponseList.filter(
      (element) => element.id !== id
    );
    console.log("user response list:::::::::", userResponse);
    setUserResponseList([...userResponse, { ...answer }]);

    // setUserResponse(
    //     [
    //         ...userResponse,

    //         [examQuestion[counter].question.id] = e.target.value]
    // )

    // const updatedAnswers = [...userResponse];

    // const id = examQuestion[counter].question.id
    // console.log('id value', id)
    // const current = { id, 'value': e.target.value };
    // console.log('current:::::::', current)
    // setAnswers(updatedAnswers);
    // setUserResponse([...userResponse, current])
    // handleAnswer(mcqQuestion?.id, e.target.value, true)
  };

  useEffect(() => {}, [userResponseList, counter]);

  const handleNext = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const { token } = JSON.parse(jwtToken);

    // console.log('user response list', userResponseList)
    console.log("next clicked ::::::");

    // const userResponse = userResponseList.filter((element) => element.id !== answer.id)
    console.log("user response list:::::::::", userResponseList);
    // console.log('answer', answer)
    // setUserResponseList([...userResponse, { ...answer }])

    // if (answer === undefined || answer === null) {
    //     console.log('not written next::::', answer)
    // }
    // else {
    //     dispatch(createExamQuestionResponse({ token, 'studentId': parseInt(studentId), 'examId': parseInt(examId), 'questionId': parseInt(singleQuestion.question.id) }))
    // }
    // ///////////////////
    if (counter < examQuestion.length - 1) {
      setCounter(counter + 1);
      setSingleQuestion(examQuestion[counter + 1]);
      // setUserResponseList([...userResponseList, answer])
      //     dispatch(fetchSingleExamQuestionResponse({ token, 'studentId': parseInt(studentId), 'examId': parseInt(examId), 'questionId': parseInt(examQuestion[counter + 1]?.question?.id) }))
      //         .then((response) => {
      //             console.log("fetched single response", response)
      //             if (response.payload.question !== null && response.payload.question !== undefined) {
      //                 console.log('inside if success', response.payload.question)
      //                 setSubmittedAnswer(response.payload)
      //             }
      //         })
    }

    // dispatch()
  };

  const handlePrev = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const { token } = JSON.parse(jwtToken);

    // console.log('prev::::', answer)
    // if (answer === undefined || answer === null) {
    //     console.log('not written next::::', answer)
    // }
    // else {
    //     console.log('answer::::::::', answer)
    //     // dispatch(createExamQuestionResponse({ token, 'studentId': parseInt(studentId), 'examId': parseInt(examId), 'questionId': parseInt(singleQuestion.question.id) }))
    //     //     .then((response) => {
    //     //         console.log('user saved resposne::::::', response)
    //     //     })
    // }
    if (counter > 0) {
      setCounter(counter - 1);
      setSingleQuestion(examQuestion[counter - 1]);
      // setSingleQuestion(examQuestion[counter + 1])
      //     dispatch(fetchSingleExamQuestionResponse({ token, 'studentId': parseInt(studentId), 'examId': parseInt(examId), 'questionId': parseInt(examQuestion[counter - 1]?.question?.id) }))
      //         .then((response) => {
      //             console.log("fetched prev response::::::", response)
      //             if (response.payload.question !== null && response.payload.question !== undefined) {
      //                 console.log('inside if success', response.payload.question)
      //                 setSubmittedAnswer(response.payload)
      //             }
      //         })
    }
    // console.log('current single question', singleQuestion)
  };

  const handleSubmit = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const { token } = JSON.parse(jwtToken);

    // const userAnswerSet = new Set(userResponse)
    // console.log('userAnswerSet', userAnswerSet)
    // const userAnswerArray = Array.from(userAnswerSet);

    // console.log('user response', userAnswerArray)
    console.log("studentId in submit btn", studentId);
    dispatch(
      updateUserExam({
        token,
        studentId: parseInt(studentId),
        examId: parseInt(examId),
      })
    ).then((response) => {
      console.log("submitted student exam response....", response);
      window.location.replace("http://localhost:3000/");
    });
    console.log("submit called::::::::");
  };

  // useEffect(() => {

  // }, [submittedAnswer])

  if (!checkLogin() || id != studentId) {
    return <NotFound />;
  }

  // console.log("examQuestionSet:::::::", examQuestion)

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="header"
        style={{ padding: 0, background: colorBgContainer }}>
        <div>Best of luck</div>
      </Header>

      <Content
        style={{
          margin: "24px 16px",
          // maxHeight: '80%'
        }}>
        <div
          style={{
            padding: 24,
            // minHeight: 360,
            // maxHeight: 800,
            height: "73vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          {singleQuestion?.question?.mcq &&
          singleQuestion?.question?.optionSet.length > 1 ? (
            // <ViewMCQ studentId={studentId} questionId={singleQuestion.question.id} examId={examId} mcqQuestion={singleQuestion?.question} questionResponse={questionResponse} handleAnswer={handleAnswer} />

            <>
              <p>id: {singleQuestion?.question?.id}</p>
              {/* <p>selected option id: {submittedAnswer?.selectedOption?.id}</p> */}

              <p className="title">Title: {singleQuestion?.question?.title}</p>
              <p className="description">
                Description: {singleQuestion?.question?.description}
              </p>

              <Radio.Group
                onChange={onChange}
                key={singleQuestion?.question?.id}
                // defaultValue={submittedAnswer?.selectedOption?.id}
              >
                <Space direction="vertical">
                  {singleQuestion.question.optionSet.map((option) => (
                    <Radio value={option?.id} key={option?.id}>
                      id {option?.id} - {option?.name}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </>
          ) : (
            // <ViewNotMCQ studentId={studentId} examId={examId} otherQuestion={singleQuestion.question} questionResponse={questionResponse} handleAnswer={handleAnswer} />
            <>
              <p>id: {singleQuestion?.question?.id}</p>
              <p className="title">Title: {singleQuestion?.question?.title}</p>
              <p className="description">
                Description: {singleQuestion?.question?.description}
              </p>
              <TextArea
                placeholder="textarea with clear icon"
                autoSize={{
                  minRows: 8,
                  maxRows: 15,
                }}
                // defaultValue={submittedAnswer?.answer !== undefined && submittedAnswer?.answer !== null ? submittedAnswer.answer : ''}
                key={singleQuestion?.question?.id}
                allowClear
                onChange={onChange}
              />
            </>
          )}
          <>
            <Button disabled={counter === 0} onClick={handlePrev}>
              Prev
            </Button>
            <Button
              disabled={counter === examQuestion.length - 1}
              onClick={handleNext}>
              Next
            </Button>
            <Popconfirm
              title="Sure to submit the exam?"
              onConfirm={handleSubmit}>
              <Button>Submit</Button>
            </Popconfirm>
          </>

          {/* <Pagination
                        // current={1}
                        // pageSize={1} //default size of page
                        {...tableParams}
                        onChange={handleChange}
                    // total={examQuestion.length} //total number of card data available
                    /> */}
        </div>
      </Content>
      <Footer
        className="footer"
        style={{ textAlign: "center", background: colorBgContainer }}>
        Nisarg Desai ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
export default GiveExam;
