import React, { useEffect, useState } from 'react';
import { Form, Popconfirm, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteRole, fetchRoles } from '../../../features/roleDetailSlice';

const Roles = () => {
  const [windowSize, setWindowSize] = useState(
    window.innerWidth
  );

  // const [roles, setRoles] = useState()

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: windowSize < 767 ? 11 : 5,
    },
  });

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  // const { jwt } = useSelector(() => state.jwt);
  // const { token } = jwt

  const { roles } = useSelector((state) => state.roles)

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

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };

  }, []);

  const handleDelete = (id) => {
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)
    console.log("delete?", id)
    // console.log()
    dispatch(deleteRole({ token, id }));
    // setData(category.content)
    // fetchData()
  }

  const navigate = useNavigate();


  const handleSaveEdited = (record) => {
    console.log(record)
    navigate("/dashboard/roles/edit", { state: { role: record } });
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
      title: 'Type',
      dataIndex: 'type',
      // width: '20%',
      // responsive: ['lg'],
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        // const editable = isEditing(record);
        return (<>

          <Typography.Link onClick={() => handleSaveEdited(record)}>
            Edit
          </Typography.Link>

        </>)
      },
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        roles.content.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];


  // const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.roles)

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)
    dispatch(fetchRoles({ token, ...tableParams.pagination }))


  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    // setData(category.content)
    setTableParams({
      ...tableParams,
      pagination: {
        current: roles.pageNumber,
        pageSize: windowSize < 767 ? 11 : roles.pageSize,
        total: roles.totalElements,
        // 200 is mock data, you should read it from server
        // total: data.totalCount,
      },
    });
  }, [roles])

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
        dataSource={roles.content}
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

export default Roles