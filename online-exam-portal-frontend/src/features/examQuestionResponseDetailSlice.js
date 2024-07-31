import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const url = 'http://localhost:8089'

//create action
export const createExamQuestionResponse = createAsyncThunk(
    "createExamQuestionResponse",
    async (data) => {
        console.log("createExamQuestionResponse option set", data)

        try {
            const response = await axios.put(`${url}/student/${data.studentId}/exam/${data.examId}/question/${data.questionId}`,
                {

                    'selectedOption': {
                        'id': data.mcq ? data.value : 0
                    },
                    'answer': data.mcq ? null : data.value
                }
                , {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })

            const result = response.data;
            console.log('response::::::::::::::', response.data)
            return result;
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }
    }
);

export const fetchSingleExamQuestionResponse = createAsyncThunk(
    "fetchSingleExamQuestionResponse",
    async (data) => {

        try {
            const response = await axios.get(`${url}/student/${data.studentId}/exam/${data.examId}/question`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })

            const result = response.data;
            return result;
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }
    }
);

export const fetchCheckedStudentExamQuestionResponse = createAsyncThunk(
    "fetchCheckedStudentExamQuestionResponse",
    async (data) => {

        try {
            const response = await axios.get(`${url}/student/${data.studentId}/exam/${data.examId}/check`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })

            const result = response.data;
            return result;
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }
    }
);

const examQuestionResponseDetail = createSlice({
    name: "examQuestionResponseDetail",
    initialState: {
        examResponse: {
            content: [],
            lastPage: true,
            pageNumber: 1,
            pageSize: 5,
            totalElements: 5,
            totalPages: 1
        },
        loading: false,
        error: null
    },
    extraReducers:
        (builder) => {
            builder
                .addCase(createExamQuestionResponse.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createExamQuestionResponse.fulfilled, (state, action) => {
                    state.loading = false;
                    // state.examResponse.content = [...state.examResponse.content, action.payload];
                })
                .addCase(createExamQuestionResponse.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(fetchSingleExamQuestionResponse.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchSingleExamQuestionResponse.fulfilled, (state, action) => {
                    state.loading = false;
                    state.examResponse.content = (action.payload);
                })
                .addCase(fetchSingleExamQuestionResponse.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(fetchCheckedStudentExamQuestionResponse.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchCheckedStudentExamQuestionResponse.fulfilled, (state, action) => {
                    state.loading = false;
                    state.examResponse.content = (action.payload);
                })
                .addCase(fetchCheckedStudentExamQuestionResponse.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

        }
})


export default examQuestionResponseDetail.reducer