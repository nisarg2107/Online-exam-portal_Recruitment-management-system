import React, { useEffect, useState } from 'react'
import { deleteQuestion, fetchQuestions } from '../../../features/questionDetailSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Popconfirm, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import Options from './options';

const Questions = () => {
  const [windowSize, setWindowSize] = useState(
    window.innerWidth
  );

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [activeExpRow, setActiveExpRow] = useState()

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
    dispatch(deleteQuestion({ token, id }));
    // setData(questions.content)
    // fetchData()
  }

  const navigate = useNavigate();


  const handleSaveEdited = (record) => {
    // console.log(record)
    navigate("/dashboard/questions/edit", { state: { question: record } });
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
    Table.EXPAND_COLUMN,
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
    },
    {
      title: 'Mcq',
      dataIndex: 'mcq',
      render: (text) => String(text),
      responsive: ['lg'],

    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '30%',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
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
        questions.content.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];


  const { questions, loading: diffLoading } = useSelector((state) => state.questions)

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)

    dispatch(fetchQuestions({ token, ...tableParams.pagination }));

  }, []);

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
      window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)
    dispatch(fetchQuestions({ token, ...tableParams.pagination }));

  }, [JSON.stringify(tableParams)]);

  // console.log("questions ===>", questions)

  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        current: questions.pageNumber,
        pageSize: windowSize < 767 ? 11 : questions.pageSize,
        total: questions.totalElements,
      },
    });
  }, [questions])

  return (
    <Form form={form}>
      <Table
        columns={columns}
        rowKey={(record) => {
          // console.log(record.id);
          return record.id
        }}
        dataSource={questions.content}
        expandable={{
          rowExpandable: (record) => {
            // console.log('record......', record)
            return record.optionSet !== null && record.optionSet !== undefined && record?.optionSet.length > 1
          },
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
  );
};


export default Questions