import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';

const url = "http://localhost:8089/category/"
//create action
// const { token } = JSON.parse(localStorage.getItem('jwtToken'));

export const createCategory = createAsyncThunk(
    "createCategory",
    async (args) => {

        console.log("category", args)
        try {
            const response = await axios.post(url,
                {
                    "type": args.type
                },
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

export const updateCategory = createAsyncThunk(
    "updateCategory",
    async (args) => {
        // console.log(data)
        try {
            const response = await axios.put(`${url}${args.id}`,
                {
                    "type": args.type
                },
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
            return err.response.data;
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "deleteCategory",
    async (args) => {
        try {
            const response = await axios.delete(`${url}${args.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${args.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })
            const result = response.data;
            console.log(result)
            return { ...result, 'id': args.id };
        } catch (err) {
            console.log("any error ?....", err)
            return err.response.data
        }

    }
);

export const fetchCategory = createAsyncThunk(
    "fetchCategory",
    async (args) => {
        try {
            console.log(args)
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

export const fetchCategoryWithoutPagination = createAsyncThunk(
    "fetchCategoryWithoutPagination",
    async (args) => {
        try {
            const response = await axios.get(`${url}?pageNumber=1&pageSize=1000`,
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

const categoryDetail = createSlice({
    name: "categoryDetail",
    initialState: {
        categories: {
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
                .addCase(createCategory.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createCategory.fulfilled, (state, action) => {
                    state.loading = false;
                    state.categories.content.push(action.payload);
                })
                .addCase(createCategory.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(fetchCategory.pending, (state) => {
                    state.loading = true;
                    console.log(state, "=========action==========")
                })
                .addCase(fetchCategory.fulfilled, (state, action) => {
                    state.loading = false;
                    state.categories = action.payload;
                    // console.log("state.difficutly", state.difficulty)
                })
                .addCase(fetchCategory.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    // console.log(state, "=========action==========")
                })

                .addCase(fetchCategoryWithoutPagination.pending, (state) => {
                    state.loading = true;
                    console.log(state, "=========action==========")
                })
                .addCase(fetchCategoryWithoutPagination.fulfilled, (state, action) => {
                    state.loading = false;
                    state.categories = action.payload;
                    // console.log("state.difficutly", state.difficulty)
                })
                .addCase(fetchCategoryWithoutPagination.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    // console.log(state, "=========action==========")
                })


                .addCase(deleteCategory.pending, (state) => {
                    state.loading = true;
                    // console.log(state, "=========action==========")
                })
                .addCase(deleteCategory.fulfilled, (state, action) => {
                    state.loading = false;
                    const { id } = action.payload;
                    // console.log("delete difficulty id", id)
                    if (id) {
                        // console.log("inside if delete")
                        state.categories.content = state.categories.content.filter((element) => element.id !== id);
                    }

                    // console.log(state.difficulty)
                })
                .addCase(deleteCategory.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload.message;
                    // console.log(state, "=========action==========")
                })


                .addCase(updateCategory.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateCategory.fulfilled, (state, action) => {
                    // console.log("is builder called ??", action.payload)
                    state.loading = false;
                    state.categories.content = state.categories.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);

                })
                .addCase(updateCategory.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


        }

})

export default categoryDetail.reducer