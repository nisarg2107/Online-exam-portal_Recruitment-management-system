import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { fetchSingleExamQuestionResponse } from '../../../features/examQuestionResponseDetailSlice';
import { useDispatch } from 'react-redux';


const ViewNotMCQ = ({ otherQuestion, handleAnswer, questionResponse, studentId, examId }) => {
    const [selectedValue, setSelectedValue] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('other question::::::::', otherQuestion)
        // console.log('other question::::::::', questionId)
        const jwtToken = localStorage.getItem('jwtToken');
        const { token } = JSON.parse(jwtToken);
        // dispatch(fetchSingleExamQuestionResponse({ 'questionId': otherQuestion?.id, token, studentId, examId }))
        //     .then((response) => {
        //         console.log('response mcq:::::::', response)
        //     })
    }, [])
    const onChange = (e) => {
        // console.log(e.target.value);
        handleAnswer(otherQuestion?.id, e.target.value, false)

    };

    return (
        <>
            <p>id: {otherQuestion?.id}</p>
            <p className='title'>Title: {otherQuestion?.title}</p>
            <p className='description'>Description: {otherQuestion?.description}</p>
            <TextArea placeholder="textarea with clear icon"
                autoSize={{
                    minRows: 8,
                    maxRows: 15,
                }}
                key={otherQuestion?.id}
                allowClear onChange={onChange} />
        </>
    )
}

export default ViewNotMCQ