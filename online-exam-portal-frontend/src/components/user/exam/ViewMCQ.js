import { Radio, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSingleExamQuestionResponse } from '../../../features/examQuestionResponseDetailSlice'

const ViewMCQ = ({ mcqQuestion, handleAnswer, questionResponse, questionId, studentId, examId }) => {
  // const [value, setValue] = useState(1);
  const [selectedValue, setSelectedValue] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('mcq::::::::::;', questionId)
    const jwtToken = localStorage.getItem('jwtToken');
    const { token } = JSON.parse(jwtToken);
    // console.log('questionId', typeof mcqQuestion?.id)
    // console.log('questionId', typeof mcqQuestion?.id)
    // console.log('questionId', typeof mcqQuestion?.id)

    // dispatch(fetchSingleExamQuestionResponse({ 'questionId': questionId, token, studentId, examId }))
    //   .then((response) => {
    //     console.log('response mcq:::::::', response)
    //     if (response.statusCode === undefined || response.statusCode === null) {
    //       setSelectedValue(0)
    //     } else {
    //       setSelectedValue(response.payload.selectedOption.id)
    //     }
    //   })
  }, [])


  // console.log('selected')

  // console.log('mcq question component:::::::;', mcqQuestion)
  const onChange = (e) => {
    // console.log('radio checked', e.target.value);
    handleAnswer(mcqQuestion?.id, e.target.value, true)
  };



  return (
    <>
      <p>id: {mcqQuestion?.id}</p>
      <p>selected option id: {typeof selectedValue}</p>

      <p className='title'>Title: {mcqQuestion?.title}</p>
      <p className='description'>Description: {mcqQuestion?.description}</p>

      <Radio.Group onChange={onChange} key={mcqQuestion?.id} value={selectedValue > 0 ? selectedValue : 0}>
        <Space direction="vertical">
          {mcqQuestion?.optionSet.map((option) =>
            <Radio value={option?.id} key={option?.id}
            // checked={selectedValue == option.id ? true : false}
            >id : {typeof option.id} - {option?.name}</Radio>
          )}
        </Space>
      </Radio.Group>
    </>
  )
}

export default ViewMCQ