import React, { useEffect, useState } from 'react';
import { Form, Popconfirm, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCategory, fetchCategory } from '../../../features/categoryDetailSlice';

const Categories = () => {
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

    // const { jwt } = useSelector(() => state.jwt);
    // const { token } = jwt

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
        dispatch(deleteCategory({ token, id }));
        // setData(category.content)
        // fetchData()
    }

    const navigate = useNavigate();


    const handleSaveEdited = (record) => {
        // console.log(record)
        navigate("/dashboard/categories/edit", { state: { category: record } });
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
            title: 'Type',
            dataIndex: 'type',
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
                categories.content.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];


    // const dispatch = useDispatch();

    const { categories, loading } = useSelector((state) => state.categories)

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }

        const { token } = JSON.parse(jwtToken)
        dispatch(fetchCategory({ token, ...tableParams.pagination }));
    }, [JSON.stringify(tableParams)]);

    useEffect(() => {
        // setData(category.content)
        setTableParams({
            ...tableParams,
            pagination: {
                current: categories.pageNumber,
                pageSize: windowSize < 767 ? 11 : categories.pageSize,
                total: categories.totalElements,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
            },
        });
    }, [categories])

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
                dataSource={categories.content}
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

export default Categories