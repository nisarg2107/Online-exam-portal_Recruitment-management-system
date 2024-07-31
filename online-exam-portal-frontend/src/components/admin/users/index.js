import React, { useEffect, useState } from 'react';
import { Divider, Form, Popconfirm, Space, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser, fetchUsers } from '../../../features/userDetailSlice';

const Users = () => {
  const [windowSize, setWindowSize] = useState(
    window.innerWidth
  );

  const [form] = Form.useForm();
  // const [users, setUsers] = useState()

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: windowSize < 767 ? 10 : 5,
    },
  });

  const dispatch = useDispatch();


  // const { jwt } = useSelector(() => state.jwt);
  // const { token } = jwt


  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    // console.log("window size", windowSize)
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)


    dispatch(fetchUsers({ token, ...tableParams.pagination }))

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };

  }, []);

  const navigate = useNavigate();

  const handleDelete = (id) => {
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)

    // console.log()
    dispatch(deleteUser({ token, id }));
    // setData(category.content)
    // fetchData()
  }

  const handleView = (id) => {

    // dispatch(fetchExams(id));

    console.log("userid", id)
    navigate("/dashboard/users/exams", { state: { userId: id } });
    // setData(questions.content)
    // fetchData()
  }

  const handleSaveEdited = (record) => {
    console.log(record)
    navigate("/dashboard/users/edit", { state: { user: record } });
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
    },
    {
      title: 'Name',
      dataIndex: 'name',
      // width: '20%',
      // responsive: ['lg'],
    },
    {
      title: 'Email',
      dataIndex: 'email',


      // width: '50%',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      render: (record) => {
        // console.log(record)
        return record.toString()
      }
      // width: '50%',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: windowSize > 767 ? '25%' : '35%',
      render: (_, record) => {
        // const editable = isEditing(record);
        return (<>
          <Space split={<Divider type="vertical" />} size={'middle'}>


            <Typography.Link onClick={() => handleView(record.id)}>
              View
            </Typography.Link>

            <Typography.Link onClick={() => handleSaveEdited(record)}>
              Edit
            </Typography.Link>

            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
              <a>{record.active ? 'Inactive' : 'Active'}</a>
            </Popconfirm>

          </Space>
        </>)
      },
    },
  ];


  // const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.users)

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)
    dispatch(fetchUsers({ token, ...tableParams.pagination }))
    

  }, [JSON.stringify(tableParams)]);



  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        current: users.pageNumber === undefined ? 1 : users.pageNumber,
        pageSize: windowSize < 767 ? 11 : users.pageSize,
        total: users.totalElements,
      }
    })
  }, [users])



  return (
    <Form
      form={form}
    >
      <Table
        columns={columns}
        rowKey={(record) => {
          // console.log(record.id);
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
        scroll={{ y: 'calc(100vh - 8em)', x: 'calc(100vh - 8em)' }}

      />
    </Form>
  );
}

export default Users