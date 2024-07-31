import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, message, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchWithoutPaginationRoles } from '../../../features/roleDetailSlice';
import { createUser, updateUser } from '../../../features/userDetailSlice';

const AddUser = () => {
    const [form] = Form.useForm();
    // const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (text, description, style) => {
        api[style]({
            message: text,
            description: description,
            placement: 'bottomRight',
        });
    };
    const [popUp, setPopUp] = useState('added')
    const [roles, setRoles] = useState({})

    // const success = () => {
    //     messageApi.open({
    //         type: 'success',
    //         content: `User ${popUp} successfully`,
    //     });
    // };

    const { state, pathname } = useLocation()
    const dispatch = useDispatch();
    // const { roles: roleItems } = useSelector((state) => state.roles)

    useEffect(() => {
        console.log(pathname, "==>", state?.user)

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        dispatch(fetchWithoutPaginationRoles({ token }))
            .then((response) => {
                console.log("roleItems ??", response.payload)
                const roleItems = response.payload.content.map(
                    (role) => {
                        return { 'value': role.id, "label": role.type }
                    }
                )
                setRoles(roleItems)
            })


        if (state?.user !== null && state?.user !== undefined) {
            console.log("inside.....?")
            setPopUp('updated')
            const fields = form.getFieldsValue("add_user_form");
            console.log("in fieldsss====", fields)
            form.setFieldsValue({ ...fields, ...state.user, 'role': state.user.role.id, 'password': 'WillNotUpdate@123' })

            // const bytes = CryptoJS.AES.decrypt(state.user.password, secretPass);
            // const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            // console.log("dcr", bytes)
        }

    }, [])

    const navigate = useNavigate();

    const submitHandler = (values) => {
        // event.preventDefault();
        // console.log(event)
        console.log(values)

        form.resetFields();

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        if (pathname.includes('/users/edit') && popUp === 'updated') {
            console.log(state.user, "in if edit pathname", values)


            const updateData = { ...state.user, ...values, 'password': 'WillNotUpdate@123' }
            console.log(updateData)
            dispatch(updateUser({ token, ...updateData }))
            window.history.replaceState({}, '')
            setTimeout(() => { navigate('/dashboard/users/view') }, 1000);
        }
        else {
            dispatch(createUser({ token, ...values }))
                .then((response) => {
                    console.log('resp::::::::::', response)
                    if (response.payload?.message && response.payload.message.includes('already exists')) {

                        openNotification('Error', response.payload.message, 'error')
                    }
                    else {
                        // success()
                        openNotification('Success', 'User added successfully', 'success')

                    }
                })
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                name="add_user_form"
                onFinish={submitHandler}
                // onSubmit={submitHandler}
                style={{
                    maxWidth: 600,
                }}
                autoComplete="off"
                form={form}

            >
                <Form.Item label="Name" name="name"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Name field cannot be empty',
                        },
                    ]}
                >
                    <Input placeholder='John' />
                </Form.Item>
                <Form.Item label="Email" name="email"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Email cannot be empty',
                        },
                        {
                            whitespace: true,
                            type: "email",
                            message: 'Please input valid email!',
                        }
                    ]}
                >
                    <Input placeholder='john@gmail.com' />
                </Form.Item>
                <Form.Item label="Password" name="password"

                    rules={[
                        {
                            required: true,
                            message: 'Password cannot be empty!',
                        },
                        {
                            pattern: /^\S+$/,
                            message: 'Password cannot contain white space!',
                        },
                        {
                            pattern: /[A-Z]/,
                            message: 'Password will need atleast 1 uppercase!',
                        },
                        {
                            pattern: /[a-z]/,
                            message: 'Password will need atleast 1 lowercase!',
                        },
                        {
                            pattern: /\d/,
                            message: 'Password will need atleast 1 number!',
                        },
                        {
                            pattern: /[!@#$%^&*(){}[\]<>?/|.:;_-]/,
                            message: 'Password will need atleast 1 special character!',
                        },
                        {
                            max: 20,
                            message: 'Password must be between 20 characters long',

                        },
                        {
                            min: 8,
                            message: 'Password must be 8 characters long !',

                        }

                    ]}
                >
                    <Input.Password placeholder='********' disabled={popUp === 'updated' ? true : false} />
                </Form.Item>
                <Form.Item
                    name="role"
                    rules={[
                        {
                            required: true,
                            message: 'Please select a value',
                        },
                    ]}
                >
                    <Select placeholder="Select Role value"
                        options={roles}
                    />
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
export default AddUser;