import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCheckedStudentExamQuestionResponse, fetchSingleExamQuestionResponse } from '../../../features/examQuestionResponseDetailSlice';
import { Button, Col, InputNumber, Row, Select } from 'antd';
import { Divider, Form, Popconfirm, Space, Table, Typography } from 'antd';
import { fetchExamByid } from '../../../features/examDetailSlice';
import { CheckOutlined } from '@ant-design/icons';
import ViewAnswer from './ViewAnswer';
import { updateUserExamAdmin, updateUserExamStatus } from '../../../features/userExamDetailSlice';
import { fetchUserById } from '../../../features/userDetailSlice';
import { Option } from 'antd/es/mentions';

// /student/{studentId}/exam/{examId}/status
const ViewUserExamResponse = () => {

    const { state, pathname } = useLocation()
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const [windowSize, setWindowSize] = useState(
        window.innerWidth
    );

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: windowSize < 767 ? 10 : 5,
        },
    });

    const [inputValue, setInputValue] = useState([])

    const [attemptedQuestions, setAttemptedQuestions] = useState([])
    const [examQuestions, setExamQuestions] = useState()

    const [user, setUser] = useState()

    const dispatch = useDispatch();

    const { studentId, examId } = useParams()
    const [activeExpRow, setActiveExpRow] = useState()

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize(window.innerWidth);
        };

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)
        dispatch(fetchSingleExamQuestionResponse({ 'examId': parseInt(examId), 'studentId': parseInt(studentId), token }))
            .then((response) => {
                console.log('fetchSingleExamQuestionResponse ::::::::: admin', response)
                const records = response.payload.map((element) => { return { 'id': element.questionId, 'value': element.obtainedMarks } })
                setAttemptedQuestions(response.payload)
                setInputValue(records)
            })

        dispatch(fetchExamByid({ 'id': parseInt(examId), token }))
            .then((response) => {
                console.log('fetchExamByid ::::::::: admin', response)
                setExamQuestions(response.payload)
                const currUser = response.payload.studentExamSet.filter((element) => element.user.id == studentId)
                if (currUser.length > 0) {
                    console.log('curr userrrr::::::::::::', currUser[0])
                    console.log('its inside right ?????', currUser[0].status)
                    setUser(currUser[0]);
                }
            })


        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };

    }, []);

    useEffect(() => {

    }, [attemptedQuestions, examQuestions])

    useEffect(() => {

    }, [JSON.stringify(tableParams)]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const handleInput = (value, record) => {
        console.log(record, 'taregt val', value)
        if (value !== null && value !== undefined && record !== undefined) {
            const notValue = inputValue.filter((element) => element.id !== record.question.id)
            const current = { 'id': record.question.id, 'value': value }
            setInputValue([...notValue, current])
        }
    }
    const handleStatus = (value) => {
        console.log('user b4', user)
        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)
        console.log('status changed ', value)
        dispatch(updateUserExamStatus({ token, 'studentId': parseInt(studentId), 'examId': parseInt(examId), 'status': value }))
            .then((response) => {
                dispatch(fetchSingleExamQuestionResponse({ token, 'examId': parseInt(examId), 'studentId': parseInt(studentId) }))
                    .then((response) => {
                        console.log('fetchSingleExamQuestionResponse ::::::::: admin', response)
                        const records = response.payload.map((element) => { return { 'id': element.questionId, 'value': element.obtainedMarks } })
                        setAttemptedQuestions(response.payload)
                        setInputValue(records)
                        dispatch(fetchUserById({ token, 'id': parseInt(studentId) }))
                            .then((response) => {
                                console.log('response after updte', response.payload)
                                const currUser = response.payload.studentExamSet.filter((element) => element.exam.id == examId)
                                console.log('curr user', currUser)
                                setUser(currUser[0])
                            })
                    })
            })
    }

    const handleSave = (record) => {
        console.log('inputValue', inputValue)
        console.log(record)
        const marks = inputValue.filter(element => element.id === record.question.id)
        const isMcq = record.question.mcq === true && record.question.optionSet.length > 1 ? true : false

        if (!isMcq) {
            const jwtToken = localStorage.getItem('jwtToken')
            const userData = JSON.parse(localStorage.getItem('userData'))
            if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
                window.location.replace('http://localhost:3000/login')
            }
            const { token } = JSON.parse(jwtToken)

            dispatch(updateUserExamAdmin({ token, 'examId': parseInt(examId), 'studentId': parseInt(studentId), 'questionId': parseInt(marks[0].id), 'marks': marks[0].value }))
                .then((response) => {
                    dispatch(fetchSingleExamQuestionResponse({ 'examId': parseInt(examId), 'studentId': parseInt(studentId), token }))
                        .then((response) => {
                            console.log('fetchSingleExamQuestionResponse ::::::::: admin', response)
                            const records = response.payload.map((element) => { return { 'id': element.questionId, 'value': element.obtainedMarks } })
                            setAttemptedQuestions(response.payload)
                            setInputValue(records)
                            dispatch(fetchUserById({ token, 'id': parseInt(studentId) }))
                        })
                })
        }

        // dispatch
        // console.log('handlesave', record)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            // responsive: ['lg'],
            render: (_, record) => record.question.id
        },
        Table.EXPAND_COLUMN,
        {
            title: 'title',
            dataIndex: 'title',
            width: '10%',
            // responsive: ['lg'],
            render: (_, record) => record.question.title

        },
        {
            title: 'description',
            dataIndex: 'description',
            width: '20%',
            // responsive: ['lg'],
            render: (_, record) => record.question.description

        },
        {
            title: 'mcq',
            dataIndex: 'mcq',
            // width: '20%',
            // responsive: ['lg'],
            width: '100',
            render: (_, record) => record.question.mcq === true && record.question.optionSet.length > 1 ? 'true' : 'false'

        },
        {
            title: 'attempted',
            dataIndex: 'attempted',
            // width: '20%',
            // responsive: ['lg'],
            width: '100',
            render: (_, record) => {
                const attempted = attemptedQuestions.filter(element => element.questionId === record.question.id)
                return (attempted[0]?.answer !== null && attempted[0]?.answer !== undefined && attempted[0]?.answer !== '')
                    || (attempted[0]?.selectedOptionId !== null && attempted[0]?.selectedOptionId !== undefined
                        && attempted[0]?.selectedOptionId > 0) ? 'attempted' : 'not attempted'
            }
        },
        {
            title: 'obtained',
            dataIndex: 'obtained',
            width: '100',
            render: (_, record) => {
                const attempted = attemptedQuestions.filter(element => element.questionId === record.question.id)
                return (attempted[0]?.answer !== null && attempted[0]?.answer !== undefined && attempted[0]?.answer !== '')
                    || (attempted[0]?.selectedOptionId !== null && attempted[0]?.selectedOptionId !== undefined
                        && attempted[0]?.selectedOptionId > 0) ? attempted[0]?.obtainedMarks : 0;
                // return attempted.obtainedMarks
            }
        },
        {
            title: 'weightage',
            dataIndex: 'weightage',
            // width: '20%',
            // responsive: ['lg'],
            width: '100',
            // render: (_, record) => record.question.description
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '15%',
            fixed: windowSize > 767 ? 'right' : '',
            // width: windowSize > 767 ? '25%' : '100',

            // render: (_, record) => {
            //     const marks = inputValue.filter(element => element.id === record.question.id)
            //     const attempted = attemptedQuestions.filter(element => element.questionId === record.question.id)
            //     // console.log('attempted marks', attempted)
            //     const check = record.question.mcq === true && record.question.optionSet.length > 1 ? true : false
            //     const other = (attempted[0]?.answer !== null && attempted[0]?.answer !== undefined && attempted[0]?.answer !== '')
            //         && (attempted[0]?.selectedOptionId === null || attempted[0]?.selectedOptionId === undefined
            //             || attempted[0]?.selectedOptionId === 0) ? true : false
            //     return (<>
            //         <Space split={<Divider type="vertical" />} size={'middle'}>

            //             <InputNumber disabled={!(check === false && other === true)} defaultValue={0} placeholder='marks' min={0} max={record.weightage} name='marks' onChange={(value) => handleInput(value, record)} />

            //             <Popconfirm disabled={!(check === false && other === true)} title="Sure to give marks?" onConfirm={() => handleSave(record)}>
            //                 <Button type='primary'
            //                     icon={<CheckOutlined />}
            //                 />
            //             </Popconfirm>

            //         </Space>
            //     </>)

            // },
            render: (_, record) => {
                // console.log(attemptedQuestions, 'rewponse record', record)
                const mcq = record.question.mcq === true && record.question.optionSet.length > 1 ? true : false
                const attempted = attemptedQuestions.filter(element => element.questionId === record.question.id)
                // console.log('input in record render', inputValue)
                // console.log('attempted', attempted)
                return (<>
                    <Space key={record.question.id} split={<Divider type="vertical" />} size={'middle'}>

                        <InputNumber disabled={mcq}
                            defaultValue={attempted.length > 0 && attempted[0].obtainedMarks ? attempted[0].obtainedMarks : 0}
                            placeholder='marks' min={0} max={record.weightage} name='marks' onChange={(value) => handleInput(value, record)}
                        />

                        <Popconfirm disabled={mcq} title="Sure to give marks?" onConfirm={() => handleSave(record)}>
                            <Button type='primary'
                                icon={<CheckOutlined />}
                            />
                        </Popconfirm>

                    </Space>
                </>)

            },
        },
    ];

    return (
        <>
            <Row
                style={{ margin: 'auto' }}
                gutter={[16, 16]}
            >
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Name</p>
                        <p>{examQuestions?.name}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Created Date</p>
                        <p>{examQuestions?.createdDate}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Start Date</p>
                        <p>{examQuestions?.startDate}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>End Date</p>
                        <p>{examQuestions?.endDate}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Duration</p>
                        <p>{examQuestions?.duration} hours</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Difficulty</p>
                        <p>{examQuestions?.difficulty?.level}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Passing marks</p>
                        <p>{examQuestions?.passingMarks}</p>
                    </div>
                </Col>
                <Col
                    xs={8} md={6} lg={3}
                    className="gutter-row" span={3}>
                    <div className='title'>
                        <p>Total marks</p>
                        <p>{examQuestions?.totalMarks}</p>
                    </div>
                </Col>
            </Row>
            <Select placeholder="Select status" value={{ value: user?.status, label: user?.status }} onChange={handleStatus}>
                <Option value="pending" label="pending" />
                <Option value="success" label="success" />
                {/* <Option value="failed">Failed</Option> */}
            </Select>

            <Table
                columns={columns}
                rowKey={(record) => {
                    // console.log('row keyyyy', record);
                    return record.question.id
                }}
                dataSource={examQuestions?.examQuestionSet}
                pagination={{
                    ...tableParams.pagination,
                    pageSizeOptions: ["1", "5", "10", "20", "25", "30"],
                    showSizeChanger: true
                }}

                expandable={{
                    rowExpandable: (record) => {
                        const attempted = attemptedQuestions.filter(element => element.questionId === record.question.id)
                        const check = record.question.mcq === true && record.question.optionSet.length > 1 ? true : false
                        const other = (attempted[0]?.answer !== null && attempted[0]?.answer !== undefined && attempted[0]?.answer !== '')
                            && (attempted[0]?.selectedOptionId === null || attempted[0]?.selectedOptionId === undefined
                                || attempted[0]?.selectedOptionId === 0) ? true : false
                        return (check === false && other === true)
                    },
                    expandedRowRender: (record) => {
                        const attempted = attemptedQuestions.filter(element => element.questionId === record.question.id)
                        const check = record.question.mcq === true && record.question.optionSet.length > 1 ? true : false
                        const other = (attempted[0]?.answer !== null && attempted[0]?.answer !== undefined && attempted[0]?.answer !== '')
                            && (attempted[0]?.selectedOptionId === null || attempted[0]?.selectedOptionId === undefined
                                || attempted[0]?.selectedOptionId === 0) ? true : false

                        return (check === false && other === true) &&
                            <ViewAnswer question={record.question} answer={attempted[0].answer} />
                    },

                    onExpand: (expanded, record) => {
                        const keys = [];
                        const id = record.question.id
                        if (expanded) {
                            // console.log('expand record', id)
                            keys.push(id);
                            // console.log(keys)
                        }
                        setActiveExpRow(keys);
                        // setActiveExpRow(record.id);
                    },

                    expandedRowKeys: activeExpRow
                }}

                onChange={handleTableChange}

                scroll={{
                    y: 'calc(100vh - 8em)',
                    x: 1300,
                }}

            />

        </>
    )
}

export default ViewUserExamResponse