import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, Form, Popconfirm, Space, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { deleteExam, fetchExams } from '../../../features/examDetailSlice';
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionOutlined, UserAddOutlined } from '@ant-design/icons';

const Exams = () => {
  const [windowSize, setWindowSize] = useState(
    window.innerWidth
  );

  const [examSet, setExamSet] = useState([])

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  const dispatch = useDispatch();

  // const [exams, setExams] = useState([])

  const [form] = Form.useForm();

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);
    // console.log('tokennnnn', token)
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)

    dispatch(fetchExams({ token, ...tableParams.pagination }))
      .then((response) => {
        console.log('exam respppp', response.payload)
        setExamSet(response.payload.content)
      })

    // dispatch(fetchExams(tableParams.pagination))
    //   .then((response) => {
    //     console.log('response out ::::::', response)
    //     setExams(response.payload.content)
    //     setTableParams({
    //       ...tableParams,
    //       pagination: {
    //         current: response.payload.pageNumber,
    //         pageSize: windowSize < 767 ? 11 : response.payload.pageSize,
    //         total: response.payload.totalElements,
    //       },
    //     });
    //   });


    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };

  }, []);

  useEffect(() => {

    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)
    // console.log("tableParams.pagination", tableParams.pagination)
    dispatch(fetchExams({ token, ...tableParams.pagination }))
      .then((response) => {
        console.log('exam respppp table sitngfy', response.payload)
        setExamSet(response.payload)
      })

  }, [JSON.stringify(tableParams)]);


  // useEffect(() => {
  //   setTableParams({
  //     ...tableParams,
  //     pagination: {
  //       current: examSet?.pageNumber,
  //       pageSize: windowSize < 767 ? 7 : examSet?.pageSize,
  //       total: examSet?.totalElements,
  //     },
  //   });
  // }, [examSet])

  // useEffect(() => {
  //   setExamSet(exams)

  // }, [exams])

  const navigate = useNavigate();

  const handleDelete = (id) => {
    console.log('delete exam called', id)
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)
    // 
    dispatch(deleteExam({ token, id }))
      .then(() => {
        dispatch(fetchExams({ token, ...tableParams.pagination }))
          .then((response) => {
            console.log('exam respppp after delete', response.payload)
            setExamSet(response.payload.content)
          })
      });
    // setData(questions.content)
    // fetchData()
  }

  const handleView = (id) => {


    // dispatch(fetchExams(id));
    // console.log('questions view', record)

    navigate("/dashboard/exams/question", { state: { examId: id } });
    // setData(questions.content)
    // fetchData()
  }

  const handleAddUsers = (id) => {

    // dispatch(fetchExams(id));

    navigate("/dashboard/exams/add/users", { state: { examId: id } });
    // setData(questions.content)
    // fetchData()
  }

  // const handleViewUsers = () => { }



  const handleSaveEdited = (record) => {

    navigate("/dashboard/exams/edit", { state: { exam: record } });
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
      // responsive: ['lg'],
      width: '100',
      fixed: windowSize > 767 ? 'left' : ''
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '100',
      fixed: windowSize > 767 ? 'left' : ''
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      render: (text) => String(text),
      // responsive: ['lg'],
      width: '100',

    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      render: (text) => String(text),
      // responsive: ['lg'],
      width: '100',

    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      render: (text) => String(text),
      // responsive: ['lg'],
      width: '100',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: (text) => String(text + ' hours'),
      // responsive: ['lg'],
      width: '100',
    },
    {
      title: 'Passing Marks',
      dataIndex: 'passingMarks',
      // width: '30%',
      width: '100',
    },
    {
      title: 'Total Marks',
      dataIndex: 'totalMarks',
      // width: '30%',
      width: '100',
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      width: '100',
      render: (obj) => {
        return obj?.level
      }
    },
    // {
    //   title: 'operation',
    //   dataIndex: 'operation',
    //   fixed: 'right',
    //   width: '100',
    //   render: (_, record) => {
    //     return (<>

    //       <Typography.Link onClick={() => handleSaveEdited(record)}>
    //         Edit
    //       </Typography.Link>

    //     </>)
    //   },
    // },
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: windowSize > 767 ? 'right' : '',
      width: '20%',
      // responsive: ['lg'],

      render: (_, record) => {
        // console.log('exam render ecord', record)
        if (record === null || record === undefined) {
          return <></>
        }
        return (
          <>
            < Space split={< Divider type="vertical" />} size={'middle'} >

              <Typography.Link onClick={() => handleAddUsers(record?.id)}>
                <Button type='primary'
                  icon={<UserAddOutlined />}
                />
              </Typography.Link>

              <Typography.Link onClick={() => handleView(record?.id)}>
                <Button type='primary'
                  icon={<QuestionOutlined />}
                />
              </Typography.Link>
              {/* 
            // <Typography.Link onClick={() => handleViewUsers(record?.id)}>
            //   <Button type='primary'
            //     icon={<PlusOutlined />}
            //   />
            // </Typography.Link> */}

              <Typography.Link onClick={() => handleSaveEdited(record)}>
                <Button type='primary'
                  icon={<EditOutlined />}
                />
              </Typography.Link>


              {/* <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record?.id)}>
                <Button type='primary'
                  icon={<DeleteOutlined />}
                />
              </Popconfirm> */}
            </Space >
          </>
        )
      }
    },
  ];

  return (
    <Form form={form}>
      <Table
        columns={columns}
        rowKey={(record) => {

          return record.id
        }}
        dataSource={examSet.content}

        pagination={{
          ...tableParams.pagination,
          pageSizeOptions: ["5", "10", "20", "25", "30"],
          showSizeChanger: true
        }}

        // loading={loading}
        onChange={handleTableChange}
        rowClassName="editable-row"
        // style={{ maxHeight: 'inherit', overflowY: 'auto', overflowX: 'auto' }}
        scroll={{ y: 'calc(100vh - 8em)', x: 1300, }}
        bordered

      />
    </Form>
  );
};

export default Exams