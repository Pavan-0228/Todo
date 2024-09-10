import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem("accessToken") || null,
};

export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "https://todo-5m23.onrender.com/api/v1/auth/register",
                userData
            );
            const { user, accessToken } = response.data;

            // Store token in local storage
            localStorage.setItem("accessToken", accessToken);

            return { user, accessToken };
        } catch (error) {

            toast.error(error.response?.data.message || "Registration failed!");

            return rejectWithValue(error.response?.data?.message || "Registration failed!");
        }
    }
);

// Login user
export const login = createAsyncThunk(
    "auth/login",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "https://todo-5m23.onrender.com/api/v1/auth/login",
                loginData
            );

            const { user, accessToken } = response.data;

            // Store token in local storage
            localStorage.setItem("accessToken", accessToken);

            return { user, accessToken };
        } catch (error) {

            console.log("login error", error)

            toast.error(error.response?.data.message || "Login failed!");

            return rejectWithValue(error.response?.data?.message || "Login failed!");
        }
    }
);


// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutSuccess: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("accessToken");
            toast.success("Logged out!");
        },
    },
    extraReducers: (builder) => {
        builder
            // For register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                toast.success("Registration successful!");
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // For login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                toast.success("Login successful!");
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logoutSuccess } = authSlice.actions;

export default authSlice.reducer;

// Thunk for logout (not async, but we still dispatch an action)
export const logout = () => (dispatch) => {
    dispatch(logoutSuccess());
};
