import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import React from 'react'

// const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MDgwMjAxNTcsImV4cCI6MTcwODEwNjU1Nywicm9sZXMiOiJST0xFX0FETUlOIn0.d-5JVdbMTtfF5mKjiTgQuyClCLFfqFbHPJ6qc3GH6QY"
const url = "http://localhost:8089/question/"
// const { token } = JSON.parse(localStorage.getItem('jwtToken'));

//create action
export const createQuestion = createAsyncThunk(
    "createQuestion",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.post(url,
                {
                    "title": data.title,
                    "description": data.description,
                    "difficulty": {
                        "id": data.difficultyId
                    },
                    "category": {
                        "id": data.categoryId
                    },
                    "optionSet": data.optionSet === undefined ? [] : data.optionSet,
                    "mcq": data.mcq

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

export const updateQuestion = createAsyncThunk(
    "updateQuestion",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.put(`${url}${data.id}`,
                {
                    "title": data.title,
                    "description": data.description,
                    "difficulty": {
                        "id": 5
                    },
                    "category": {
                        "id": 5
                    },
                    "optionSet": data.optionSet === undefined ? null : data.optionSet,
                    "mcq": data.mcq

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

export const fetchQuestions = createAsyncThunk(
    "fetchQuestions",
    async (data) => {

        try {
            // console.log(data)
            const response = await axios.get(`${url}?pageNumber=${data.current}&pageSize=${data.pageSize}`,
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

export const deleteQuestion = createAsyncThunk(
    "deleteQuestion",
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

const questionDetail = createSlice({
    name: "questionDetail",
    initialState: {
        questions: {
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
                .addCase(createQuestion.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createQuestion.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log('action question payload', action.payload)
                    state.questions.content.push(action.payload);
                })
                .addCase(createQuestion.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(updateQuestion.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateQuestion.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log("payload", action.payload)
                    state.questions.content = state.questions.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);
                })
                .addCase(updateQuestion.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(fetchQuestions.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchQuestions.fulfilled, (state, action) => {
                    state.loading = false;
                    state.questions = action.payload
                })
                .addCase(fetchQuestions.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(deleteQuestion.pending, (state) => {
                    state.loading = true;
                })
                .addCase(deleteQuestion.fulfilled, (state, action) => {
                    state.loading = false;
                    const { id } = action.payload;
                    if (id) {
                        console.log("inside if delete")
                        state.questions.content = state.questions.content.filter((element) => element.id !== id);
                    }

                    console.log(state.questions)
                })
                .addCase(deleteQuestion.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        }
})

export default questionDetail.reducer