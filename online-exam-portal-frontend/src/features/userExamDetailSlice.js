import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import React from 'react'

const url = "http://localhost:8089/student/"
const userUrl = "http://localhost:8089/user/"

//create action
export const createUserExam = createAsyncThunk(
    "createUserExam",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.post(`${url}${data.userId}/exam/${data.examId}`,

                {
                    "user": {
                        "id": data.userId
                    },
                    "exam": {
                        "id": data.examId
                    },
                    "passed": false,
                    'marks': 0,

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

export const updateUserExam = createAsyncThunk(
    "updateUserExam",
    async (data) => {
        console.log("updateUserExam", data)

        try {
            const response = await axios.put(`${url}${data.studentId}/exam/${data.examId}`,

                {
                    "user": {
                        "id": data.studentId
                    },
                    "exam": {
                        "id": data.examId
                    },
                    "passed": false,
                    'marks': 0,
                    'submitted': true
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

export const updateUserExamStatus = createAsyncThunk(
    "updateUserExam",
    async (data) => {
        console.log("updateUserExam", data)

        try {
            const response = await axios.put(`${url}${data.studentId}/exam/${data.examId}/status`,

                {
                    "status": data.status
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

export const updateUserExamAdmin = createAsyncThunk(
    "updateUserExamAdmin",
    async (data) => {
        console.log("updateUserExamAdmin", data)


        try {
            const response = await axios.put(`${url}${data.studentId}/exam/${data.examId}/question/${data.questionId}/marks/${data.marks}`,
                {

                },
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

export const updateUser = createAsyncThunk(
    "updateUser",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.put(`${url}${data.id}`,
                {

                    "name": data.name,
                    "email": data.email,
                    "password": data.password,
                    "role": {
                        "id": data.role
                    }

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

export const fetchUserExams = createAsyncThunk(
    "fetchUserExams",
    async (data) => {

        try {
            // console.log(tableParams)
            const response = await axios.get(`${userUrl}${data.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })
            const result = response.data;
            console.log("fetchUserExams::::::::", result)
            return result;
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }
    }
);

export const deleteUserExam = createAsyncThunk(
    "deleteUserExam",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.delete(`${url}${data.userId}/exam/${data.examId}`,

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



const userExamDetail = createSlice({
    name: "userExamDetail",
    initialState: {
        userExam: {
            content: [],
            studentExamSet: []
        },
        loading: false,
        error: null
    },
    extraReducers:
        (builder) => {
            builder
                .addCase(createUserExam.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createUserExam.fulfilled, (state, action) => {
                    state.loading = false;
                    state.userExam.content.push(action.payload);
                })
                .addCase(createUserExam.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(updateUserExam.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateUserExam.fulfilled, (state, action) => {
                    state.loading = false;
                    state.userExam.content = state.userExam.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);
                })
                .addCase(updateUserExam.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(updateUserExamAdmin.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateUserExamAdmin.fulfilled, (state, action) => {
                    state.loading = false;
                    state.userExam.content = state.userExam.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);
                })
                .addCase(updateUserExamAdmin.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(updateUser.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateUser.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log("payload", action.payload)
                    state.userExam.content = state.userExam.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);
                })
                .addCase(updateUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(fetchUserExams.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchUserExams.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log("action.payload:::::", action.payload)
                    state.userExam.studentExamSet = action.payload.studentExamSet
                })
                .addCase(fetchUserExams.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                // .addCase(fetchUserById.pending, (state) => {
                //     state.loading = true;
                // })
                // .addCase(fetchUserById.fulfilled, (state, action) => {
                //     state.loading = false;
                //     state.userExam = action.payload
                // })
                // .addCase(fetchUserById.rejected, (state, action) => {
                //     state.loading = false;
                //     state.error = action.payload;
                // })


                .addCase(deleteUserExam.pending, (state) => {
                    state.loading = true;
                })
                .addCase(deleteUserExam.fulfilled, (state, action) => {
                    state.loading = false;
                    const { id } = action.payload;
                    if (id) {
                        console.log("inside if delete")
                        state.userExam = action.payload
                    }

                    console.log(state.userExam)
                })
                .addCase(deleteUserExam.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        }
})


export default userExamDetail.reducer