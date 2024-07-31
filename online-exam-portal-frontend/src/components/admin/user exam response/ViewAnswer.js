import TextArea from 'antd/es/input/TextArea'
import React from 'react'

const ViewAnswer = ({ key, answer, question }) => {
    return (
        <div >
            <p className='title'>Title: {question?.title}</p>
            <p className='description'>Description: {question?.description}</p>
            <TextArea placeholder="textarea with clear icon"
                autoSize={{
                    minRows: 8,
                    maxRows: 15,
                }}
                key={question?.id}
                value={answer}
                disabled={true} />
        </div>
    )
}

export default ViewAnswer