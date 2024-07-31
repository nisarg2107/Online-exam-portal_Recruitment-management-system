import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import React from 'react'

// const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MDc5NzQ0NDksImV4cCI6MTcwODA2MDg0OSwicm9sZXMiOiJST0xFX0FETUlOIn0.jI4L5qkSvE5KKu2u2VAuX0Kf4kmbJUqQ7MEwgAJ6af8"
const url = "http://localhost:8089/difficulty/"
const fetchAll = "http://localhost:8089/difficulty/"
const deleteData = "http://localhost:8089/difficulty/"

// const { token } = JSON.parse(localStorage.getItem('jwtToken'));


const initialState = {
    difficulty: {
        content: [],
        lastPage: true,
        pageNumber: 1,
        pageSize: 5,
        totalElements: 5,
        totalPages: 1

    },
    loading: true,
    error: null
}

//create action
export const createDifficulty = createAsyncThunk(
    "createDifficulty",
    async (data) => {
        console.log(data?.difficulty)

        // axios.post(url,
        //     {
        //         "level": data.difficulty
        //     }
        //     , {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },

        //     })
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });

        try {
            const response = await axios.post(url,
                {
                    "level": data.difficulty
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

export const updateDifficulty = createAsyncThunk(
    "updateDifficulty",
    async (difficulty) => {
        console.log("in update", difficulty)

        // axios.post(url,
        //     {
        //         "level": data.difficulty
        //     }
        //     , {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },

        //     })
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });

        try {
            const response = await axios.put(`${url}${difficulty.id}`,
                {
                    "level": difficulty.level
                },
                {
                    headers: {
                        'Authorization': `Bearer ${difficulty.token}`,
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

export const deleteDifficulty = createAsyncThunk(
    "deleteDifficulty",
    async (data) => {
        console.log("delete slice====================", data.id)

        // axios.delete(url + id,
        //     {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },

        //     })
        //     .then(response => {
        //         console.log("delete response=========", response)
        //         // return id;
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         return error;
        //     });

        try {
            const response = await axios.delete(`${deleteData}${data.id}`,
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

export const fetchDifficulty = createAsyncThunk(
    "fetchDifficulty",
    async (data) => {

        // await axios.get(fetchAll,
        //     {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },

        //     })
        //     .then(response => {
        //         console.log("=========in redux : ", response.data)
        //         if (response.status === 200) {

        //             const result = response.data;
        //             console.log("reult before fulfilled", result)
        //             return result;
        //         }
        //         // initialState.difficulty = response.data.content
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         return rejectWithValue("Opps found an error", error.response.data);
        //     });

        try {
            // console.log(tableParams)
            const response = await axios.get(`${fetchAll}?pageNumber=${data.current}&pageSize=${data.pageSize}`,
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

export const fetchDifficultyWithoutPagination = createAsyncThunk(
    "fetchDifficultyWithoutPagination",
    async (data) => {

        try {
            const response = await axios.get(`${fetchAll}?pageNumber=1&pageSize=1000`,
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

const difficultyDetail = createSlice({
    name: "difficultyDetail",
    initialState,
    extraReducers:
        (builder) => {
            builder
                .addCase(createDifficulty.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createDifficulty.fulfilled, (state, action) => {
                    state.loading = false;
                    state.difficulty.content.push(action.payload);
                })
                .addCase(createDifficulty.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(fetchDifficulty.pending, (state) => {
                    state.loading = true;
                    console.log(state, "=========action==========")
                })
                .addCase(fetchDifficulty.fulfilled, (state, action) => {
                    state.loading = false;
                    state.difficulty = action.payload;
                    console.log("state.difficutly", state.difficulty)
                })
                .addCase(fetchDifficulty.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    console.log(state, "=========action==========")
                })

                .addCase(fetchDifficultyWithoutPagination.pending, (state) => {
                    state.loading = true;
                    console.log(state, "=========action==========")
                })
                .addCase(fetchDifficultyWithoutPagination.fulfilled, (state, action) => {
                    state.loading = false;
                    state.difficulty = action.payload;
                    console.log("state.difficutly", state.difficulty)
                })
                .addCase(fetchDifficultyWithoutPagination.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    console.log(state, "=========action==========")
                })


                .addCase(deleteDifficulty.pending, (state) => {
                    state.loading = true;
                    console.log(state, "=========action==========")
                })
                .addCase(deleteDifficulty.fulfilled, (state, action) => {
                    state.loading = false;
                    const { id } = action.payload;
                    console.log("delete difficulty id", id)
                    if (id) {
                        console.log("inside if delete")
                        state.difficulty.content = state.difficulty.content.filter((element) => element.id !== id);
                    }

                    console.log(state.difficulty)
                })
                .addCase(deleteDifficulty.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload.message;
                    console.log(state, "=========action==========")
                })


                .addCase(updateDifficulty.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateDifficulty.fulfilled, (state, action) => {
                    console.log("is builder called ??", action.payload)
                    state.loading = false;
                    state.difficulty.content = state.difficulty.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);

                })
                .addCase(updateDifficulty.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


        }
})

export default difficultyDetail.reducer