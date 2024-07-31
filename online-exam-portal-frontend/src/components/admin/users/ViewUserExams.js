import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteQuestion, fetchQuestions } from '../../../features/questionDetailSlice';
import { Col, Form, Popconfirm, Table, Typography } from 'antd';
import { fetchUserById } from '../../../features/userDetailSlice';
import { fetchCheckedStudentExamQuestionResponse } from '../../../features/examQuestionResponseDetailSlice';

const ViewUserExams = () => {
    const [examDetails, setExamDetails] = useState([])
    const { state, pathname } = useLocation()
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const [windowSize, setWindowSize] = useState(
        window.innerWidth
    );

    const dispatch = useDispatch();


    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize(window.innerWidth);
        };

        if (!(state?.userId)) {
            window.history.replaceState({}, '')
            navigate("/dashboard/users/view");
        }

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        console.log('userId', state.userId)
        window.addEventListener('resize', handleWindowResize);
        dispatch(fetchUserById({ token, 'id': state.userId }))
            .then((response) => {
                // console.log("setyttttttttttt", response.payload)
                // const questionSet = response.payload.examQuestionSet
                //     .map((element) => {
                //         return { ...element.question, 'weightage': element.weightage }
                //     })

                // // console.log("ques set=====", questionSet)
                const examData = response.payload.studentExamSet.map((element) => {
                    return {
                        'marks': element.marks,
                        'passed': element.passed,
                        'submitted': element.submitted,
                        'id': element.exam.id,
                        'name': element.exam.name,
                        'passingMarks': element.exam.passingMarks,
                        'totalMarks': element.exam.totalMarks,
                        'startDate': element.exam.startDate,
                        'endDate': element.exam.endDate,

                    }

                })

                // console.log('exam data::::::::', examData)

                examData.forEach(element => {
                    dispatch(fetchCheckedStudentExamQuestionResponse({ 'examId': parseInt(element.id), 'studentId': parseInt(state.userId), token }))
                        .then((response) => {
                            console.log('checked response mcq', response.payload)
                            setExamDetails(examData)
                        })

                });

                // console.log('data', examData)
                // setExamDetails({ 'name': response.payload.name, 'createdDate': response.payload.createdDate, 'startDate': response.payload.startDate, 'endDate': response.payload.endDate, 'duration': response.payload.duration, 'difficulty': response.payload.difficulty.level, 'passingMarks': response.payload.passingMarks, 'totalMarks': response.payload.totalMarks, })
                // setExamQuestionSet(questionSet)
            });


        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };

    }, []);

    // const { exams, loading } = useSelector((state) => state.exams)
    // const { content: data } = exams

    // useEffect(() => {
    //     // console.log("view data exam", data)
    // }, [examQuestionSet])

    const handleViewResponse = (record) => {

        console.log(state.userId, 'view called', record.id)
        navigate(`/dashboard/student/${state.userId}/exam/${record.id}/response`)

    }

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            responsive: ['lg'],
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'startDate',
            dataIndex: 'startDate',
            responsive: ['lg'],
        },
        {
            title: 'endDate',
            dataIndex: 'endDate',
            responsive: ['lg'],
        },
        {
            title: 'passed',
            dataIndex: 'passed',
            render: (text) => String(text),

        },
        {
            title: 'submitted',
            dataIndex: 'submitted',
            render: (text) => String(text),

        },
        {
            title: 'passing marks',
            dataIndex: 'passingMarks',
            // render: (text) => String(text),

        },
        {
            title: 'obtained marks',
            dataIndex: 'marks',
            // render: (text) => String(text),

        },
        {
            title: 'total marks',
            dataIndex: 'totalMarks',
            // render: (text) => String(text),

        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                return (<>

                    <Typography.Link onClick={() => handleViewResponse(record)}>
                        View response
                    </Typography.Link>

                </>)
            },
        },
        // {
        //     title: 'operation',
        //     dataIndex: 'operation',
        //     render: (_, record) =>
        //         examQuestionSet.length >= 1 ? (
        //             <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
        //                 <a>Delete</a>
        //             </Popconfirm>
        //         ) : null,
        // },
    ];


    // const { loading: diffLoading } = useSelector((state) => state.questions)

    useEffect(() => {
        // dispatch(fetchQuestions(tableParams.pagination));

    }, [JSON.stringify(tableParams)]);

    // console.log("questions ===>", questions)

    // useEffect(() => {
    //     setTableParams({
    //         ...tableParams,
    //         pagination: {
    //             current: examQuestionSet.pageNumber,
    //             pageSize: windowSize < 767 ? 11 : 5,
    //             total: examQuestionSet.length,
    //         },
    //     });
    // }, [examQuestionSet])

    return (
        <>

            <Form form={form}>
                <Table
                    columns={columns}
                    rowKey={(record) => {
                        // console.log(record.id);
                        return record.id
                    }}
                    dataSource={examDetails}


                    pagination={{
                        ...tableParams.pagination,
                        pageSizeOptions: ["5", "10", "20", "25", "30"],
                        showSizeChanger: true
                    }}

                    // loading={diffLoading}
                    onChange={handleTableChange}
                    rowClassName="editable-row"
                    // style={{ maxHeight: 'inherit', overflowY: 'auto', overflowX: 'auto' }}
                    scroll={{ y: 'calc(100vh - 8em)', x: 'calc(100vh - 8em)' }}


                />
            </Form>
        </>
    );
};

export default ViewUserExams