import { Divider, Form, Popconfirm, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserExams } from '../../../features/userExamDetailSlice';
import moment from 'moment';

const AllUserExams = () => {

    const [windowSize, setWindowSize] = useState(
        window.innerWidth
    );

    const [form] = Form.useForm();

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: windowSize < 767 ? 10 : 5,
        },
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userExam, loading } = useSelector((state) => state.userExam)


    // useEffect(() => {
    //     dispatch(fetchUsers({ token, ...tableParams.pagination }))


    // }, [JSON.stringify(tableParams)]);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        console.log('userdata', userData)

        if (userData.id !== null && userData.id !== undefined) {
            dispatch(fetchUserExams({ token, 'id': userData.id }))
        }

        // setUserExamSet(userExam)
        // console.log("all exam user:::::::", userExam)

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };

    }, []);

    useEffect(() => {

    }, [JSON.stringify(tableParams)]);


    useEffect(() => {
        // console.log('all user exam changed:::::::::::', userExam)
    }, [userExam])

    // useEffect(() => {
    //     setTableParams({
    //         ...tableParams,
    //         pagination: {
    //             current: users.pageNumber === undefined ? 1 : users.pageNumber,
    //             pageSize: windowSize < 767 ? 11 : users.pageSize,
    //             total: users.totalElements,
    //         }
    //     })
    // }, [userExamSet])

    const enterFullscreen = () => {
        const elem = document.getElementById('table-full-screen')
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            elem.webkitRequestFullscreen();
        }
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
            document.webkitExitFullscreen();
        }
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    };

    const handleView = (record) => {
        console.log(record, 'view :::::::::;')
        navigate(`/student/${record?.user?.id}/exam/${record?.exam?.id}/view`)
    }

    const handleStart = (record) => {
        // console.log("started:::::::::::", record)

        const { id } = JSON.parse(localStorage.getItem('userData'));
        // navigate(`/student/${id}/exam/${record.exam.id}`)
        navigate(`/student/${id}/exam/${record.exam.id}/info`)

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
            render: (_, record) => record.exam.id

        },
        {
            title: 'Name',
            dataIndex: 'name',
            // width: '20%',
            // responsive: ['lg'],
            render: (_, record) => record.exam.name

        },
        {
            title: 'Start date',
            dataIndex: 'startDate',
            render: (_, record) => record.exam.startDate
            // width: '50%',
        },
        {
            title: 'End date',
            dataIndex: 'endDate',
            render: (_, record) => record.exam.endDate
            // width: '50%',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            render: (_, record) => `${record.exam.duration} hours`
            // width: '50%',
        },
        {
            title: 'Total marks',
            dataIndex: 'totalMarks',
            render: (_, record) => {
                // console.log("student exam record", record.exam.totalMarks)
                return record.exam.totalMarks
            }
            // width: '50%',
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            // width: '25%',
            render: (_, record) => {
                // console.log('here render::::: start dtae ', record.exam.startDate, 'curr date', new Date(), 'end date', record.exam.endDate)
                // const editable = isEditing(record);
                // console.log('start date', moment(record.exam.startDate, 'DD-MM-YYYY'))
                // console.log('end date', moment(record.exam.endDate, 'DD-MM-YYYY'))
                const currDate = moment(new Date()).format("DD/MM/YYYY")
                // console.log('startDate', record.exam.startDate, 'currdate', currDate, 'endDate', record.exam.endDate)
                // console.log('lets check',)
                if (record.exam.startDate < currDate && record.exam.endDate < currDate) {
                    return (<>
                        <Space split={<Divider type="vertical" />} size={'middle'}>

                            {
                                record.submitted === true
                                    ?
                                    <Typography.Link onClick={() => handleView(record)}>
                                        View
                                    </Typography.Link>
                                    :
                                    <Typography.Link>
                                        Missed
                                    </Typography.Link>
                            }
                        </Space>
                    </>)
                } else if (record.exam.startDate <= currDate && currDate <= record.exam.endDate) {
                    // console.log('ongoing', record.exam.name)
                    return (<>
                        <Space split={<Divider type="vertical" />} size={'middle'}>

                            {
                                record.submitted === true
                                    ?
                                    <Typography.Link onClick={() => handleView(record)}>
                                        View
                                    </Typography.Link>
                                    :
                                    <Popconfirm title="Sure to start?" onConfirm={() => handleStart(record)}>
                                        <a>Start</a>
                                    </Popconfirm>
                            }
                        </Space>
                    </>)
                }
                else {
                    return (<>
                        <Typography.Link>
                            Upcoming
                        </Typography.Link>
                    </>)
                }
            },
        },
    ];
    return (
        <Form
            form={form}
        >
            <Table id='table-full-screen'
                columns={columns}
                rowKey={(record) => {
                    // console.log(record.id);
                    return record.id
                }}
                dataSource={userExam.studentExamSet}
                pagination={{
                    ...tableParams.pagination,
                    pageSizeOptions: ["5", "10", "20", "25", "30"],
                    showSizeChanger: true
                }}

                loading={loading}
                onChange={handleTableChange}
                rowClassName="editable-row"
                scroll={{ y: 'calc(100vh - 8em)', x: 'calc(100vh - 8em)' }}

            />
        </Form>
    )
}

export default AllUserExams