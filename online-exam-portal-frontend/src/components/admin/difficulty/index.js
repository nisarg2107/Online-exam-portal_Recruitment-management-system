import React, { useEffect, useState } from 'react';
import { Form, Popconfirm, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteDifficulty, fetchDifficulty } from '../../../features/difficultyDetailSlice';
import { store } from '../../../app/store';
import axios from 'axios';

const Difficulty = () => {
  const [windowSize, setWindowSize] = useState(
    window.innerWidth
  );
  // const [data, setData] = useState();
  // const [loading, setLoading] = useState(true)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

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
    dispatch(deleteDifficulty({ token, id }));
    // setData(difficulty.content)
    // fetchData()
  }

  const navigate = useNavigate();


  const handleSaveEdited = (record) => {
    // console.log(record)
    navigate("/dashboard/difficulty/edit", { state: record });
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
    },
    {
      title: 'Level',
      dataIndex: 'level',
      width: '20%',
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
        difficulty.content.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];


  // const dispatch = useDispatch();

  const { difficulty, loading: diffLoading } = useSelector((state) => state.difficulty)

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)
    dispatch(fetchDifficulty({ token, ...tableParams.pagination }));
    //  const execute = async () => {
    //    const data = await fetchData();
    //  };
    // execute();

    //   .then(response => {
    // console.log("response : ", response.data)
    // initialState.difficulty = response.data.content
    // setLoading(false);

  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    // setData(difficulty.content)
    setTableParams({
      ...tableParams,
      pagination: {
        current: difficulty.pageNumber,
        pageSize: windowSize < 767 ? 11 : difficulty.pageSize,
        total: difficulty.totalElements,
        // 200 is mock data, you should read it from server
        // total: data.totalCount,
      },
    });
  }, [difficulty])

  return (
    <Form form={form}
    // component={false}
    >
      <Table
        // components={{
        //   body: {
        //     cell: EditableCell,
        //   },
        // }}
        columns={columns}
        rowKey={(record) => {
          // console.log(record.id);
          return record.id
        }}
        dataSource={difficulty.content}
        pagination={{
          ...tableParams.pagination,
          pageSizeOptions: ["5", "10", "20", "25", "30"],
          showSizeChanger: true
        }}

        loading={diffLoading}
        onChange={handleTableChange}
        rowClassName="editable-row"
        scroll={{ y: 'calc(100vh - 8em)', x: 'calc(100vh - 8em)' }}
      />
    </Form>
  );
};
export default Difficulty;