import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllUser = createAsyncThunk('user/getAllUser', () => {
    return http.httpGet('user');
});

export const getUserById = createAsyncThunk('user/getUserById', (id) => {
    return http.httpGet(`user/${id}`);
});

export const update = createAsyncThunk('user/update', (data) => {
    return http.httpPut(`user/${data.id}`, data);
});

export const add = createAsyncThunk('user/add', (data) => {
    return http.httpPost('user', data);
});

// Slice
const slice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        user: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllUser
        builder.addCase(getAllUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
            state.error = '';
        });
        builder.addCase(getAllUser.rejected, (state, action) => {
            state.loading = false;
            state.users = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getUserById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserById.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = '';
        });
        builder.addCase(getUserById.rejected, (state, action) => {
            state.loading = false;
            state.user = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.users = state.users.map((item) => (item.id === action.payload.id ? action.payload : item));
            }
            state.users = state.users.filter((x) => x.status === 1);
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // add user
        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
