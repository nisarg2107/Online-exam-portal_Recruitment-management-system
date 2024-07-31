import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchExamByid } from '../../../features/examDetailSlice';
import { fetchUsers } from '../../../features/userDetailSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Divider, Form, Popconfirm, Row, Space, Table, Typography, notification } from 'antd';
import { createUserExam, deleteUserExam } from '../../../features/userExamDetailSlice';
import { UserAddOutlined } from '@ant-design/icons';

const AddExamUsers = () => {

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (action) => {
        api.success({
            message: `User ${action} successfully`,
            description: `User ${action} to exam successfully`,
            placement: 'bottomRight',
        });
    };

    const [userSet, setUserSet] = useState([])
    const [examDetails, setExamDetails] = useState({})
    const { state } = useLocation()
    const navigate = useNavigate();

    const [form] = Form.useForm();


    const [windowSize, setWindowSize] = useState(
        window.innerWidth
    );

    const dispatch = useDispatch();

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });


    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize(window.innerWidth);
        };

        if (state === null || state === undefined || state.examId === null || state.examId === undefined) {
            window.history.replaceState({}, '')
            navigate("/dashboard/exams/view");
        }

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        // console.log('exam-id', state.examId)
        window.addEventListener('resize', handleWindowResize);
        // console.log('token in user exam', token)
        dispatch(fetchExamByid({ token, 'id': state?.examId }))
            .then((response) => {
                console.log("fetch exam by id line 57:::::::", response.payload)
                // const questionSet = response.payload.examQuestionSet
                //     .map((element) => {
                //         return { ...element.question, 'weightage': element.weightage }
                //     })

                // console.log("ques set=====", questionSet)
                setExamDetails({ token, 'id': response.payload.id, 'name': response.payload.name, 'createdDate': response.payload.createdDate, 'startDate': response.payload.startDate, 'endDate': response.payload.endDate, 'duration': response.payload.duration, 'difficulty': response.payload.difficulty?.level, 'passingMarks': response.payload.passingMarks, 'totalMarks': response.payload.totalMarks })
                // setExamQuestionSet(questionSet)
            });

        console.log('fetch user b4 token line 68:::::::::', { token, ...tableParams.pagination })
        dispatch(fetchUsers({ token, ...tableParams.pagination }))
            .then((response) => {
                console.log("user response========", response)

                console.log('got the response right')
            });


        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };

    }, []);

    // const { exams, loading } = useSelector((state) => state.exams)
    // const { content: data } = exams

    // console.log('user set====', userSet)



    // const handleDelete = (id) => {
    //     console.log("delete?", id)
    //     // console.log()
    //     // dispatch(deleteQuestion(id));
    //     // setData(questions.content)
    //     // fetchData()
    // }

    // const handleSaveEdited = (record) => {
    //     // console.log(record)
    //     // navigate("/dashboard/questions/edit", { state: { question: record } });
    // }

    const handleViewResponse = (record) => {
        console.log(examDetails, 'handleViewResponse:::::::::', record)
        navigate(`/dashboard/student/${parseInt(record.id)}/exam/${examDetails.id}/response`)
    }


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
            width: '10%',
            fixed: 'left'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '15%',
            fixed: 'left'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '20%',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (record) => {
                // console.log('record...', record)
                return record.type
            },

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            fixed: 'right',
            width: '15%',
            render: (_, record) => {
                const jwtToken = localStorage.getItem('jwtToken')
                const userData = JSON.parse(localStorage.getItem('userData'))
                if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
                    window.location.replace('http://localhost:3000/login')
                }
                const { token } = JSON.parse(jwtToken)
                // console.log('record in column????', record)
                const studentExam = record.studentExamSet.filter((element) => {
                    if (element.exam.id === examDetails.id) {
                        return {
                            ...element.exam
                        }
                    }
                })

                console.log(record, '+++++++++student exam++++++++++', studentExam)

                if (record.role.type.includes('ADMIN')) {
                    return <></>
                }


                if (studentExam.length > 0 && studentExam[0].exam.id === examDetails.id && studentExam[0].submitted === true) {
                    return <>
                        <Typography.Link onClick={() => handleViewResponse(record)}>
                            <Button type='primary'>View response</Button>
                        </Typography.Link>
                    </>
                }

                return <>
                    <Space split={<Divider type="vertical" />} size={'middle'}>


                        {studentExam.length > 0 && examDetails.id === studentExam[0].exam.id
                            ?
                            <Popconfirm title="Sure to delete?"
                                onConfirm={() => {
                                    const jwtToken = localStorage.getItem('jwtToken')
                                    const userData = JSON.parse(localStorage.getItem('userData'))
                                    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
                                        window.location.replace('http://localhost:3000/login')
                                    }
                                    const { token } = JSON.parse(jwtToken)
                                    // console.log('delete==============', record)
                                    dispatch(deleteUserExam({ token, 'userId': record.id, 'examId': examDetails.id }))
                                        .then((response) => {
                                            // console.log('user exam response', response)
                                            openNotificationWithIcon('deleted');
                                            dispatch(fetchUsers({ token, ...tableParams.pagination }))
                                        })
                                }}
                            >
                                <a>Delete</a>
                            </Popconfirm>
                            :
                            <Popconfirm title="Sure to add?"
                                onConfirm={() => {
                                    const jwtToken = localStorage.getItem('jwtToken')
                                    const userData = JSON.parse(localStorage.getItem('userData'))
                                    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
                                        window.location.replace('http://localhost:3000/login')
                                    }
                                    const { token } = JSON.parse(jwtToken)
                                    // console.log('add==============', record)
                                    // console.log('exam details', examDetails)
                                    dispatch(createUserExam({ token, 'userId': record.id, 'examId': examDetails.id }))
                                        .then((response) => {
                                            // console.log('user exam response', response)
                                            openNotificationWithIcon('added');
                                            dispatch(fetchUsers({ token, ...tableParams.pagination }))
                                        })
                                }}>
                                <a>Add</a>
                            </Popconfirm>
                        }
                    </Space>
                </>
            }
        },
    ];

    const { users, loading } = useSelector((state) => state.users)

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        dispatch(fetchUsers({ token, ...tableParams.pagination }))
        // .then((response) => {
        //     // console.log("user response========", response)
        //     setUserSet(response.payload.content)
        //     setTableParams({
        //         ...tableParams,
        //         pagination: {
        //             current: response.payload.pageNumber,
        //             pageSize: windowSize < 767 ? 11 : response.payload.pageSize,
        //             total: response.payload.totalElements,
        //         },
        //     });
        // });
    }, [JSON.stringify(tableParams)]);

    useEffect(() => {
        console.log('users on use change', users.content)
        setTableParams({
            ...tableParams,
            pagination: {
                current: users.pageNumber === undefined ? 1 : users.pageNumber,
                pageSize: windowSize < 767 ? 11 : users.pageSize,
                total: users.totalElements,
            }
        })
    }, [users])

    useEffect(() => {

    }, [users])

    return (
        <>
            {contextHolder}

            <Row
                style={{ margin: 'auto' }}
                gutter={[16, 16]}
            >
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Name</p>
                        <p>{examDetails.name}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Created Date</p>
                        <p>{examDetails.createdDate}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Start Date</p>
                        <p>{examDetails.startDate}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>End Date</p>
                        <p>{examDetails.endDate}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Duration</p>
                        <p>{examDetails.duration} hours</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Difficulty</p>
                        <p>{examDetails.difficulty}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Passing marks</p>
                        <p>{examDetails.passingMarks}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Total marks</p>
                        <p>{examDetails.totalMarks}</p>
                    </div>
                </Col>
            </Row>


            <Form form={form}>
                <Table
                    columns={columns}
                    rowKey={(record) => {

                        return record.id
                    }}
                    dataSource={users.content}

                    pagination={{
                        ...tableParams.pagination,
                        pageSizeOptions: ["5", "10", "20", "25", "30"],
                        showSizeChanger: true
                    }}

                    loading={loading}
                    onChange={handleTableChange}
                    rowClassName="editable-row"
                    // style={{ maxHeight: 'inherit', overflowY: 'auto', overflowX: 'auto' }}
                    scroll={{ y: 'calc(100vh - 8em)', x: 1300, }}
                    bordered

                />
            </Form>
        </>
    );
};

export default AddExamUsers