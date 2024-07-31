import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createRole, fetchRoles, updateRole } from '../../../features/roleDetailSlice';

const AddRole = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [popUp, setPopUp] = useState('added')
    const [roles, setRoles] = useState({})

    const success = () => {
        messageApi.open({
            type: 'success',
            content: `Role ${popUp} successfully`,
        });
    };

    const { state, pathname } = useLocation()
    const dispatch = useDispatch();

    const jwtToken = localStorage.getItem('jwtToken')
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
        window.location.replace('http://localhost:3000/login')
    }
    const { token } = JSON.parse(jwtToken)

    useEffect(() => {
        if (state?.role !== null && state?.role !== undefined) {
            console.log("inside.....?")
            setPopUp('updated')
            const fields = form.getFieldsValue("add_role_form");
            console.log("in fieldsss====", fields)
            form.setFieldsValue({ ...fields, 'type': state.role.type })
        }
    }, [])

    const navigate = useNavigate();

    const submitHandler = (values) => {
        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        form.resetFields();
        success()
        if (pathname.includes('/roles/edit') && popUp === 'updated') {
            console.log(state.user, "in if edit pathname", values)


            const updateData = { ...state.role, ...values }
            console.log('update', updateData)
            dispatch(updateRole({ token, ...updateData }))
            window.history.replaceState({}, '')
            setTimeout(() => { navigate('/dashboard/roles/view') }, 1000);
        }
        else {
            dispatch(createRole({ token, ...values }))
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                name="add_role_form"
                onFinish={submitHandler}
                // onSubmit={submitHandler}
                style={{
                    maxWidth: 600,
                }}
                autoComplete="off"
                form={form}

            >
                <Form.Item label="Type" name="type"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Type cannot be empty',
                        },
                        {
                            pattern: /^\S+$/,
                            message: "Type cannot contain white space"
                        },
                    ]}
                >
                    <Input placeholder='MANAGER' />
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

export default AddRole