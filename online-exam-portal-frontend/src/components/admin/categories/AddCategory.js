import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space, Switch, message } from 'antd';
import { useDispatch } from 'react-redux';
import { createCategory, updateCategory } from '../../../features/categoryDetailSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkLogin } from '../../../utils';

const AddCategory = () => {

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [popUp, setPopUp] = useState('added')

    const success = () => {
        messageApi.open({
            type: 'success',
            content: `Category ${popUp} successfully`,
        });
    };

    const { state, pathname } = useLocation()
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(pathname, "==>", state)

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        if (state?.category !== null && state?.category !== undefined) {
            console.log("inside.....?")
            setPopUp('updated')
            const fields = form.getFieldsValue("add_category_form");
            console.log(fields)
            form.setFieldsValue({ ...fields, 'type': state.category.type })
        }
    }, [])

    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log(values)
        success()
        form.resetFields();

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        if (pathname.includes('/categories/edit') && popUp === 'updated') {
            console.log(state.category, "in if edit pathname", values)
            const updateData = { ...state.category, 'type': values.type }
            console.log(updateData)
            dispatch(updateCategory({ token, ...updateData }))
            window.history.replaceState({}, '')
            setTimeout(() => { navigate('/dashboard/categories/view') }, 1000);
        }
        else {
            dispatch(createCategory({ token, ...values }))
        }
    };


    return (
        <>
            {contextHolder}
            <Form
                name="add_category_form"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
                autoComplete="off"
                form={form}

            >
                <Form.Item label="Category" name="type"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Category field cannot be empty',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
export default AddCategory;