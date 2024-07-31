import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchExamByid } from '../../../features/examDetailSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, fetchQuestions } from '../../../features/questionDetailSlice';
import { Col, Form, Popconfirm, Row, Table, Typography } from 'antd';
import Options from '../questions/options';


const ViewExamQuestions = () => {
    const [examQuestionSet, setExamQuestionSet] = useState([])
    const [examDetails, setExamDetails] = useState({})
    const { state, pathname } = useLocation()
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const [activeExpRow, setActiveExpRow] = useState()

    const [windowSize, setWindowSize] = useState(
        window.innerWidth
    );

    const dispatch = useDispatch();


    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize(window.innerWidth);
        };

        if (!state?.examId) {
            window.history.replaceState({}, '')
            navigate("/dashboard/exams/view");
        }

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        console.log('exam-id', state.examId)
        window.addEventListener('resize', handleWindowResize);
        dispatch(fetchExamByid({ 'id': state.examId, token }))
            .then((response) => {
                console.log("setyttttttttttt", response.payload)
                const questionSet = response.payload.examQuestionSet
                    .map((element) => {
                        return { ...element.question, 'weightage': element.weightage }
                    })

                // console.log("ques set=====", questionSet)
                setExamDetails({ 'name': response.payload.name, 'createdDate': response.payload.createdDate, 'startDate': response.payload.startDate, 'endDate': response.payload.endDate, 'duration': response.payload.duration, 'difficulty': response.payload.difficulty.level, 'passingMarks': response.payload.passingMarks, 'totalMarks': response.payload.totalMarks, })
                setExamQuestionSet(questionSet)
            });


        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };



    }, []);

    // const { exams, loading } = useSelector((state) => state.exams)
    // const { content: data } = exams

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });



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
        Table.EXPAND_COLUMN,
        {
            title: 'Title',
            dataIndex: 'title',
            width: '20%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '30%',
        },
        {
            title: 'Weightage',
            dataIndex: 'weightage',
            // width: '30%',
            width: '15%'
        },
        {
            title: 'Mcq',
            dataIndex: 'mcq',
            render: (text) => String(text),

        },
        // {
        //     title: 'operation',
        //     dataIndex: 'operation',
        //     render: (_, record) => {
        //         return (<>

        //             <Typography.Link onClick={() => handleSaveEdited(record)}>
        //                 Edit
        //             </Typography.Link>

        //         </>)
        //     },
        // },
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


    const { loading: diffLoading } = useSelector((state) => state.questions)

    useEffect(() => {
        // dispatch(fetchQuestions(tableParams.pagination));

    }, [JSON.stringify(tableParams)]);

    // console.log("questions ===>", questions)

    // useEffect(() => {

    // }, [diffLoading])

    useEffect(() => {
        setTableParams({
            ...tableParams,
            pagination: {
                current: examQuestionSet.pageNumber,
                pageSize: windowSize < 767 ? 11 : 5,
                total: examQuestionSet.length,
            },
        });
    }, [examQuestionSet])

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
                        // console.log(record.id);
                        return record.id
                    }}
                    dataSource={examQuestionSet}
                    expandable={{
                        rowExpandable: (record) => record.optionSet.length > 2,
                        expandedRowRender: (record) => (
                            record.optionSet.length > 1 &&
                            <Options options={record.optionSet} />
                        ),

                        onExpand: (expanded, record) => {
                            const keys = [];
                            if (expanded) {
                                keys.push(record.id);
                            }
                            setActiveExpRow(keys);
                            // setActiveExpRow(record.id);
                        },

                        expandedRowKeys: activeExpRow
                    }}

                    pagination={{
                        ...tableParams.pagination,
                        pageSizeOptions: ["5", "10", "20", "25", "30"],
                        showSizeChanger: true
                    }}

                    loading={diffLoading}
                    onChange={handleTableChange}
                    rowClassName="editable-row"
                    // style={{ maxHeight: 'inherit', overflowY: 'auto', overflowX: 'auto' }}
                    scroll={{ y: 'calc(100vh - 8em)', x: 'calc(100vh - 8em)' }}


                />
            </Form>
        </>
    );
};


export default ViewExamQuestions