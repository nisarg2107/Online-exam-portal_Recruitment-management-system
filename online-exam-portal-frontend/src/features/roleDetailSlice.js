import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const url = "http://localhost:8089/role/"
//create action
export const createRole = createAsyncThunk(
    "createRole",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.post(url,
                {
                    "type": data.type
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

export const updateRole = createAsyncThunk(
    "updateRole",
    async (data) => {
        console.log("slice option set", data)

        try {
            const response = await axios.put(`${url}${data.id}`,
                {

                    "type": data.type

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

export const fetchRoles = createAsyncThunk("fetchRoles",
    async (data) => {
        try {
            console.log("try...??")
            const response = await axios.get(`${url}?pageNumber=${data.current}&pageSize=${data.pageSize}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })
            const result = response.data;
            console.log("roles.......", result)
            return result;
        } catch (err) {
            // console.log("any error ?....", err)
            return err.response.data;
        }
    }
)

export const fetchWithoutPaginationRoles = createAsyncThunk("fetchRoles",
    async (data) => {
        try {
            console.log("try...??")
            const response = await axios.get(`${url}?pageNumber=1&pageSize=1000`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },

                })
            const result = response.data;
            console.log("roles.......", result)
            return result;
        } catch (err) {
            // console.log("any error ?....", err)
            return err.response.data;
        }
    }
)
export const deleteRole = createAsyncThunk(
    "deleteRole",
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

const roleDetail = createSlice({
    name: "roleDetail",
    initialState: {
        roles: {
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
                .addCase(createRole.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createRole.fulfilled, (state, action) => {
                    state.loading = false;
                    state.roles.content.push(action.payload);
                })
                .addCase(createRole.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(updateRole.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateRole.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log("payload", action.payload)
                    state.roles.content = state.roles.content
                        .map((element) => element.id === action.payload.id ? action.payload : element);
                })
                .addCase(updateRole.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })


                .addCase(fetchRoles.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchRoles.fulfilled, (state, action) => {
                    state.loading = false;
                    state.roles = action.payload
                    console.log("fullfilled", state.roles)
                })
                .addCase(fetchRoles.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    console.log("rejected ??", state.error)
                })


                .addCase(deleteRole.pending, (state) => {
                    state.loading = true;
                })
                .addCase(deleteRole.fulfilled, (state, action) => {
                    state.loading = false;
                    const { id } = action.payload;
                    if (id) {
                        console.log("inside if delete")
                        state.roles.content = state.roles.content.filter((element) => element.id !== id);
                    }

                    console.log(state.roles)
                })
                .addCase(deleteRole.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        }
})


export default roleDetail.reducer