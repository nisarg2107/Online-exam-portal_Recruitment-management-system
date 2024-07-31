import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { checkLogin } from "../utils";

const url = "http://localhost:8089/auth/login";

export const jwtLogin = createAsyncThunk(
  "jwtLogin",
  async (credentials, { rejectWithValue }) => {
    console.log("jwt...", credentials);
    try {
      const response = await axios.post(`${url}`, {
        email: credentials.username,
        password: credentials.password,
      });
      const result = response.data;
      return result;
    } catch (err) {
      console.log("any error ?....", err);
      localStorage.clear();
      return rejectWithValue(err.response.data);
    }
  }
);

const authDetails = createSlice({
  name: "authDetails",
  initialState: {
    jwt: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(jwtLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(jwtLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload;
        localStorage.setItem("jwtToken", JSON.stringify(state.jwt));
        // checkLogin()
      })
      .addCase(jwtLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        localStorage.clear();
      });
  },
});

export default authDetails.reducer;
