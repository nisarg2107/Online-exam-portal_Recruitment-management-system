import React, { useEffect, useState } from 'react';
import { Input, List, Pagination, Radio, Space } from 'antd';
import { useParams } from 'react-router-dom';
import { Button, Layout, Menu, theme } from 'antd';
import NotFound from '../../NotFound';
import { checkLogin } from '../../../utils';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { fetchExamByid } from '../../../features/examDetailSlice';
import { useDispatch } from 'react-redux';
import ViewMCQ from './ViewMCQ';
import ViewNotMCQ from './ViewNotMCQ';
import { createExamQuestionResponse } from '../../../features/examQuestionResponseDetailSlice';

const GiveExam = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // const pagination = {
    //     current: 1,
    //     pageSize: examQuestion.length,
    // }

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 1,
            total: 1
        },
    });

    const [questionResponse, setQuestionResponse] = useState({})
    const [examQuestion, setExamQuestion] = useState([])
    const [singleQuestion, setSingleQuestion] = useState({})
    // const [answer, setAnswer] = useState({})
    const [isStudentEligible, setIsStudentEligible] = useState(false)
    const dispatch = useDispatch();

    const { studentId, examId } = useParams()
    // console.log('student id', typeof studentId, 'exam id', examId)


    const { id } = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken === null || jwtToken === undefined) {
            window.location.replace('http://localhost:3000/')
        }
        const { token } = JSON.parse(jwtToken);
        // console.log('token:::::', token)
        dispatch(fetchExamByid({ 'id': parseInt(examId), "token": token }))
            .then((response) => {
                console.log('response::::::', response.payload.examQuestionSet)
                setExamQuestion(response.payload.examQuestionSet)
                setSingleQuestion(response.payload.examQuestionSet[0])
                setTableParams({ ...tableParams.pagination, 'total': response.payload.examQuestionSet.length })
            })
    }, [])



    if (!checkLogin() || id != studentId) {
        return <NotFound />
    }


    // console.log("examQuestionSet:::::::", examQuestion)
    return <>
        Do something

        {examQuestion?.map((element) => {
            console.log(element)
            return (

                element?.question?.mcq === true && element?.question?.optionSet.length > 1 ?
                    <div>
                        
                    </div>
                    :
                    <div>
                        
                    </div>
            )
        })}
    </>
};
export default GiveExam