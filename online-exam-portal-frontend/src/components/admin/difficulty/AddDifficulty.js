import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { createDifficulty, updateDifficulty } from '../../../features/difficultyDetailSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const AddDifficulty = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [popUp, setPopUp] = useState('added')

    const success = () => {
        messageApi.open({
            type: 'success',
            content: `Difficulty ${popUp} successfully`,
        });
    };

    const { state: difficulty, pathname } = useLocation()
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(pathname, "==>", difficulty)

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)


        if (difficulty !== null && difficulty !== undefined) {
            console.log("inside.....?")
            setPopUp('updated')
            const fields = form.getFieldsValue("add_difficulty_form");
            console.log(fields)
            form.setFieldsValue({ ...fields, 'difficulty': difficulty.level })
        }

    }, [])

    const navigate = useNavigate();

    const submitHandler = (values) => {
        // event.preventDefault();
        // console.log(event)
        console.log(values)

        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        form.resetFields();
        success()
        if (pathname.includes('/difficulty/edit') && popUp === 'updated') {
            console.log(difficulty, "in if edit pathname", values)
            const updateData = { ...difficulty, 'level': values.difficulty }
            console.log(updateData)
            dispatch(updateDifficulty({ token, ...updateData }))
            window.history.replaceState({}, '')
            setTimeout(() => { navigate('/dashboard/difficulty/view') }, 1000);
        }
        else {
            dispatch(createDifficulty({ token, ...values }))
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                name="add_difficulty_form"
                onFinish={submitHandler}
                // onSubmit={submitHandler}
                style={{
                    maxWidth: 600,
                }}
                autoComplete="off"
                form={form}

            >
                <Form.Item label="Difficulty" name="difficulty"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Difficulty field cannot be empty',
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
export default AddDifficulty;