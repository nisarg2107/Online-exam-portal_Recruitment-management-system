import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import React from 'react'

const url = "http://localhost:8089/user/"

//create action
export const createUser = createAsyncThunk(
    "createUser",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.post(url,
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

export const fetchUsers = createAsyncThunk(
    "fetchUsers",
    async (data) => {

        try {
            console.log('fetch user token', data)
            const response = await axios.get(`${url}?pageNumber=${data.current}&pageSize=${data.pageSize}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })
            const result = response.data;
            console.log('fetch user response', result)
            return result;
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data;
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "fetchUserById",
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
            return result;
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }
    }
);

export const deleteUser = createAsyncThunk(
    "deleteUser",
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

const userDetail = createSlice({
    name: "userDetail",
    initialState: {
        users: {
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
                .addCase(createUser.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createUser.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log('action.payload', action.payload)
                    state.users.content.push(action.payload);
                })
                .addCase(createUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(updateUser.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateUser.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log("payload", action.payload)
                    state.users.content = state.users.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);
                })
                .addCase(updateUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(fetchUsers.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchUsers.fulfilled, (state, action) => {
                    state.loading = false;
                    state.users = action.payload
                })
                .addCase(fetchUsers.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(fetchUserById.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchUserById.fulfilled, (state, action) => {
                    state.loading = false;
                    state.users = action.payload
                })
                .addCase(fetchUserById.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(deleteUser.pending, (state) => {
                    state.loading = true;
                })
                .addCase(deleteUser.fulfilled, (state, action) => {
                    state.loading = false;
                    const { id } = action.payload;
                    if (id) {
                        console.log("inside if delete")
                        state.users.content = state.users.content.filter((element) => element.id !== id);
                    }

                    console.log(state.users)
                })
                .addCase(deleteUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        }
})


export default userDetail.reducer