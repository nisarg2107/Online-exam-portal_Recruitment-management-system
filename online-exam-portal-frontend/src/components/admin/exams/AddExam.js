import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { fetchDifficultyWithoutPagination } from '../../../features/difficultyDetailSlice';
import { fetchCategoryWithoutPagination } from '../../../features/categoryDetailSlice';
import { generateExam, updateExam } from '../../../features/examDetailSlice';
import './add-exam.scss'
import { format } from 'crypto-js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';


const AddExam = () => {
    dayjs.extend(customParseFormat);
    const [form] = Form.useForm();
    const [popUp, setPopUp] = useState('added')
    const [difficulty, setDifficulty] = useState({})
    const [categories, setCategories] = useState([])
    const { RangePicker } = DatePicker;
    const dateFormat = 'DD/MM/YYYY';
    const { state, pathname } = useLocation()
    const disabledDate = (current) => {
        // return dayjs().endOf('day') > current;
        // console.log('current date', current)
        // if (popUp === 'added') {
        return moment().add(-1, 'days') >= current
        // }
        // return;
    };

    const rules = {
        passing: [
            {
                required: true,
                message: 'Passing marks cannot be empty',
            },
            (formInstance) => ({
                message: 'Passing marks cannot be greater than total marks',
                validator(rule, value) {
                    if (value === null) {
                        return Promise.resolve();
                    }
                    const totelValue = formInstance.getFieldValue('total');
                    if (value > totelValue) {
                        return Promise.reject(new Error());
                    }
                    return Promise.resolve();
                },
            }),

        ],
        total: [

            (formInstance) => ({
                message: 'Please select atleast one category',
                validator(rule, value) {
                    if (value === 0) {
                        return Promise.reject(new Error());
                    }
                    return Promise.resolve();

                },
            })

        ],
        category: [
            // (formInstance, message) => ({
            //     message: message,
            //     validator(rule, value) {


            //         console.log('===============> field..?', value, 'rule', rule)

            //         // if (count === 0) {
            //         //     return Promise.reject(new Error('please select atleast one category'));
            //         // }
            //         return Promise.resolve();
            //     },
            // }),

            (formInstance, message) => ({
                message: message,
                validator(rule, value) {


                    let count = categories.length;
                    console.log("count??? b4", count)

                    categories.forEach((category, index) => {
                        if (
                            (parseInt(
                                formInstance.getFieldValue(`${category?.label}_id_${index}`)
                                    !== undefined ? formInstance.getFieldValue(`${category?.label}_id_${index}`)
                                    : 0
                            ) *
                                parseInt(
                                    formInstance.getFieldValue(`marks_${category?.label}${index}`)
                                        !== (undefined && null) ? formInstance.getFieldValue(`marks_${category?.label}${index}`)
                                        : 5
                                )) === 0
                        ) {
                            count--;
                        }
                    })
                    console.log("count a4???", count)

                    if (count === 0) {
                        return Promise.reject(new Error('please select atleast one category'));
                    }
                    return Promise.resolve();
                },
            }),

        ],

        categoryNotFirst: [
            (formInstance, message) => ({
                message: message,
                validator(rule, value) {


                    const category = categories.filter((element, index) =>

                        rule.field === `${element.label}_id_${index}`
                    )
                    console.log(category, '===============> field..?', value, 'rule', rule)
                    // formInstance.getFieldValue(`${category.label}_id_${index}`)
                    if (category?.questionSet?.length < value) {
                        return Promise.reject(new Error(`please select between ${category.questionSet.length} range`));
                    }
                    return Promise.resolve();
                },
            }),
        ]


    };

    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: `Exam ${popUp} successfully`,
        });
    };

    const dispatch = useDispatch();

    useEffect(() => {
        // console.log(pathname, "==>", state)
        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        dispatch(fetchDifficultyWithoutPagination({ token }))
            .then(({ payload }) => {
                const difficultyItems = payload.content.map(
                    (difficulty) => {
                        return { 'value': difficulty.id, "label": difficulty.level }
                    }
                )
                setDifficulty(difficultyItems)
            })

        dispatch(fetchCategoryWithoutPagination({ token }))
            .then(({ payload }) => {
                // console.log("cet items========", payload.content)
                const categoryItems = payload.content.map(
                    (category) => {
                        return { 'value': category.id, "label": category.type, 'questionSet': category.questionSet }
                    }
                )
                setCategories(categoryItems)
            })
        if (state?.exam !== null && state?.exam !== undefined) {
            console.log("inside.....?", state.exam)
            setPopUp('updated')
            const fields = form.getFieldsValue("add_exam_form");
            console.log('fields-----', fields)
            // moment(values.date[0].$d)
            form.setFieldsValue({
                ...fields, 'name': state.exam.name, 'duration': state.exam.duration, 'passing': state.exam.passingMarks, 'total': state.exam.totalMarks, 'difficulty': state.exam.difficulty.id,
                // 'date': [moment(state.exam.startDate === (null || undefined) ? moment() : moment(state.exam.startDate), 'YYYY/MM/DD'),
                // moment(state.exam.endDate === (null || undefined) ? moment() : moment(state.exam.startDate), 'YYYY/MM/DD')]
                // 'date': [moment(new Date), moment(new Date)]
                // 'date': [moment(state.exam.startDate, 'DD/MM/YYYY'), moment(state.exam.endDate, 'DD/MM/YYYY')]
            })
        }
    }, [])

    // useEffect(() => {

    // }, [categories])


    const navigate = useNavigate();

    const onFinish = (values) => {
        const jwtToken = localStorage.getItem('jwtToken')
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (jwtToken === null || jwtToken === undefined || !userData?.role.includes('ADMIN')) {
            window.location.replace('http://localhost:3000/login')
        }
        const { token } = JSON.parse(jwtToken)

        success()
        let obj = categories.map((category, index) => {
            delete values[`${category?.label}_id_${index}`]
            delete values[`marks_${category?.label}${index}`]
            if (
                form.getFieldValue(`${category?.label}_id_${index}`) !== undefined &&
                form.getFieldValue(`${category?.label}_id_${index}`)
                > 0
            ) {
                return {
                    'id': category.value,
                    'type': category.label,
                    'number': form.getFieldValue(`${category?.label}_id_${index}`),
                    'marks': form.getFieldValue(`marks_${category?.label}${index}`) !== (undefined && null) ? form.getFieldValue(`marks_${category?.label}${index}`) : 5,
                }
            }
            return null;
        })
        obj = obj.filter((element) => element !== null)
        const examData = {
            ...values, 'categorySet': obj, 'createdDate': moment(new Date()).format("DD/MM/YYYY"),
            'startDate': moment(values.date[0].$d).format("DD/MM/YYYY"),
            'endDate': moment(values.date[1].$d).format("DD/MM/YYYY")
        }
        delete examData['date']
        console.log('exam data:::::::::::::', examData)
        form.resetFields();
        if (pathname.includes('/exams/edit') && popUp === 'updated') {
            console.log(state.exam, "in if edit pathname", values)
            const updateData = { 'id': state.exam.id, ...examData }
            console.log('update-------------', updateData)
            dispatch(updateExam({ token, ...updateData }))
            window.history.replaceState({}, '')
            setTimeout(() => { navigate('/dashboard/exams/view') }, 1000);
        }
        else {
            dispatch(generateExam({ token, ...examData }))
        }
    };

    const handleCategory = (values) => {
        console.log(categories, "deopdown categiry", values)
        let newTotal = parseInt(0);
        newTotal = categories.map((category, index) => {
            console.log('type of', newTotal + parseInt(form.getFieldValue(`${category?.label}_id_${category?.value}`)))
            console.log('type of marks', form.getFieldsValue(`add_exam_form`))
            console.log(category)
            return newTotal + (
                parseInt(
                    form.getFieldValue(`${category?.label}_id_${index}`)
                        !== undefined && form.getFieldValue(`${category?.label}_id_${index}`) !== null
                        ? form.getFieldValue(`${category?.label}_id_${index}`)
                        : 0
                ) *
                parseInt(
                    form.getFieldValue(`marks_${category?.label}${index}`)
                        !== undefined && form.getFieldValue(`marks_${category?.label}${index}`) !== null
                        ? form.getFieldValue(`marks_${category?.label}${index}`)
                        : 5
                )
            )
        })

        console.log('new toatal', newTotal)
        console.log("nt", newTotal.reduce((partialSum, a) => partialSum + a, 0))

        form.setFieldValue(['total'], newTotal.reduce((partialSum, a) => partialSum + a, 0))
    }

    return (
        <>
            {contextHolder}
            <Form
                name="add_exam_form"
                onFinish={onFinish}
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
                            message: 'Exam name cannot be empty',
                        },
                        // {
                        //     pattern: /^(?!\s*$)[-a-zA-Z0-9_:,.' ']$/,
                        //     message: 'Exam name is containing invalid spaces!',
                        // },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name='date' label='Date picker'
                    rules={[
                        {
                            required: true,
                            message: 'Please choose start date and end date',
                        }
                    ]}>
                    <RangePicker
                        picker="date"
                        format={dateFormat}
                        disabledDate={disabledDate}
                        id={{
                            start: 'startInput',
                            end: 'endInput',
                        }}
                    // defaultValue={[dayjs(state?.exam.startDate, dateFormat), dayjs(state?.exam.endDate, dateFormat)]}

                    />
                </Form.Item>


                <Space
                    style={{
                        display: 'flex',
                        marginBottom: 8,

                    }}
                    align="start"
                >
                    <Form.Item
                        name={'passing'}
                        rules={rules.passing}
                        label='Passing marks'
                    >
                        <InputNumber min={0} placeholder="23" />
                    </Form.Item>
                    <Form.Item
                        name={'total'}
                        rules={rules.total}
                        label='Total marks'

                    >
                        <InputNumber disabled min={1} placeholder="100" />
                    </Form.Item>
                </Space>

                <Space
                    style={{
                        display: 'flex',
                        marginBottom: 8,

                    }}
                    align="start"
                >
                    <Form.Item
                        name={'duration'}
                        rules={[
                            {
                                required: true,
                                message: 'Duration cannot be empty',
                            }
                        ]}
                        label='Duration'
                    >
                        <InputNumber min={0} step={'0.01'} placeholder="1.50" />
                    </Form.Item>

                    {
                        <Form.Item
                            label='Difficulty'
                            name="difficulty"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a value',
                                },
                            ]}
                        >
                            <Select placeholder="Select difficulty value"
                                options={difficulty}
                                disabled={popUp === 'updated' ? true : false}
                            />
                        </Form.Item>}
                </Space>

                {popUp === 'added' && categories.map((category, index) => {
                    return <div className={'show-error-div'}>
                        <Space
                            style={{
                                display: 'flex',
                                marginBottom: 8,

                            }}
                            align="start"
                            className={'show-error'}

                        >
                            <Form.Item
                                name={`${category?.label}_id_${index}`}
                                label={category?.label}
                                key={`${category?.label}_id_${index}`}
                                rules={
                                    `${category?.label}_id_${index}` === `${category?.label}_id_0`
                                    // ? rules.category : category.questionSet.length > 1 && rules.categoryNotFirst
                                    && rules.category
                                }
                                className={'show-error'}


                            >
                                <InputNumber
                                    disabled={category.questionSet.length < 1 ? true : false}
                                    min={0}
                                    max={category.questionSet.length}
                                    onChange={() => handleCategory(category)} defaultValue={0} placeholder="5" />
                            </Form.Item>
                            <Form.Item
                                name={`marks_${category?.label}${index}`}
                                label={'marks'}
                                key={`marks_${category?.label}${index}`}
                                className={'show-error'}
                            >
                                <InputNumber
                                    disabled={category.questionSet.length < 1 ? true : false}
                                    min={1} onChange={() => handleCategory(category)} defaultValue={5} placeholder="5" />
                            </Form.Item>
                        </Space>
                        {category.questionSet.length < 1 && <span className='error'>This category dont have any questions</span>}
                        {
                            category.questionSet.length >= 1 &&
                            <p className='questions'>This category has {category.questionSet.length} questions</p>
                        }
                    </div>
                })}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        </>
    )
}

export default AddExam