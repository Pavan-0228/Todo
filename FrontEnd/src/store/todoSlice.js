import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1/todo",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Utility function to handle API errors
const handleError = (error, defaultMessage) => {
    const message = error.response?.data?.message || defaultMessage;
    // toast.error(message);
    return message;
};

// Initial state
const initialState = {
    todos: [],
    loading: false,
    error: null,
};

// Thunks for API calls using createAsyncThunk

// Fetch all todos
export const fetchTodos = createAsyncThunk(
    "todos/fetchTodos",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/");
            return response.data.todo;
        } catch (error) {
            // toast.error(error.response?.data.message || "Failed to fetch todos!");
            return rejectWithValue(
                handleError(error, "Failed to fetch todos!")
            );
        }
    }
);

// Create a new todo
export const createTodo = createAsyncThunk(
    "todos/createTodo",
    async (todoData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/", todoData);
            toast.success("Todo created successfully!");
            return response.data.todo; 
        } catch (error) {
            toast.error(error.response?.data.message || "Failed to create todo!");
            return rejectWithValue(
                handleError(error, "Failed to create todo!")
            );
        }
    }
);

// Update a todo
export const updateTodo = createAsyncThunk(
    "todos/updateTodo",
    async ({ todoId, updates }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/${todoId}`, updates);
            toast.success("Todo updated successfully!");
            return response.data.todo; 
        } catch (error) {
            toast.error(error.response?.data.message || "Failed to update todo!");
            return rejectWithValue(
                handleError(error, "Failed to update todo!")
            );
        }
    }
);

// Delete a todo
export const deleteTodo = createAsyncThunk(
    "todos/deleteTodo",
    async (todoId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/${todoId}`);
            toast.success("Todo deleted successfully!");
            return todoId;
        } catch (error) {
            toast.error(error.response?.data.message || "Failed to delete todo!");
            return rejectWithValue(
                handleError(error, "Failed to delete todo!")
            );
        }
    }
);

// Slice
const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch todos
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.loading = false;
                state.todos = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create todo
            .addCase(createTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTodo.fulfilled, (state, action) => {
                state.loading = false;
                state.todos.push(action.payload);
            })
            .addCase(createTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update todo
            .addCase(updateTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.todos.findIndex(
                    (todo) => todo._id === action.payload._id
                );
                if (index !== -1) {
                    state.todos[index] = action.payload;
                }
            })
            .addCase(updateTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete todo
            .addCase(deleteTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.loading = false;
                state.todos = state.todos.filter(
                    (todo) => todo._id !== action.payload
                );
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default todoSlice.reducer;
