import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import moment from 'moment';
import React from 'react'
import { checkLogin } from '../utils';

// const { token } = JSON.parse(localStorage.getItem('jwtToken'));

const url = "http://localhost:8089/exam/"
const generateUrl = "http://localhost:8089/exam/generate/category"


//create action
export const generateExam = createAsyncThunk(
    "generateExam",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.post(generateUrl,
                {
                    "name": data.name,
                    "createdDate": data.createdDate,
                    "startDate": data.startDate,
                    "endDate": data.endDate,
                    "duration": data.duration,
                    "passingMarks": data.passing,
                    "totalMarks": data.total,
                    "difficulty": {
                        "id": data.difficulty
                    },
                    "categoryWithMarksDtoSet": data.categorySet


                }
                , {
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

export const updateExam = createAsyncThunk(
    "updateExam",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.put(`${url}${data.id}`,
                {

                    "name": data.name,
                    // "createdDate": data.createdDate,
                    "startDate": data.startDate,
                    "endDate": data.endDate,
                    "duration": data.duration,
                    "passingMarks": data.passing,
                    // "totalMarks": data.total,

                }
                , {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })

            const result = response.data;
            console.log("result updated ques", result)
            return result;
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }
    }
);

export const fetchExams = createAsyncThunk(
    "fetchExams",
    async (args) => {


        try {
            // console.log(args)
            const response = await axios.get(`${url}?pageNumber=${args.current}&pageSize=${args.pageSize}`,
                {
                    headers: {
                        'Authorization': `Bearer ${args.token}`,
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

export const fetchExamByid = createAsyncThunk(
    "fetchExamByid",
    async (data) => {

        try {
            // console.log(tableParams)
            const response = await axios.get(`${url}${data.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })
            const result = response.data;
            // console.log("exams", result)
            return result;
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }
    }
);

export const deleteExam = createAsyncThunk(
    "deleteExam",
    async (data) => {

        try {
            const response = await axios.delete(`${url}${data.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })
            const result = response.data;
            console.log(result)
            return { ...result, 'id': data.id };
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }

    }
);

const examDetail = createSlice({
    name: "examDetail",
    initialState: {
        exams: {
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
                .addCase(generateExam.pending, (state) => {
                    state.loading = true;
                })
                .addCase(generateExam.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log('action.payload', action.payload)
                    state.exams.content = [...state.exams.content, { ...action.payload }];
                })
                .addCase(generateExam.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(updateExam.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateExam.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log("payload", action.payload)
                    state.exams.content = state.exams.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);
                })
                .addCase(updateExam.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(fetchExams.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchExams.fulfilled, (state, action) => {
                    state.loading = false;
                    state.exams = action.payload
                })
                .addCase(fetchExams.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(fetchExamByid.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchExamByid.fulfilled, (state, action) => {
                    state.loading = false;
                    state.exams.content = action.payload
                })
                .addCase(fetchExamByid.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(deleteExam.pending, (state) => {
                    state.loading = true;
                })
                .addCase(deleteExam.fulfilled, (state, action) => {
                    state.loading = false;
                    const { id } = action.payload;
                    if (id) {
                        console.log("inside if delete")
                        state.exams.content = state.exams.content.filter((element) => element.id !== id);
                    }

                    console.log(state.exams)
                })
                .addCase(deleteExam.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        }
})


export default examDetail.reducer