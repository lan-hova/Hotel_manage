import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllService = createAsyncThunk('service/getAllService', () => {
    return http.httpGet('service');
});

export const getServiceById = createAsyncThunk('service/getServiceById', (id) => {
    return http.httpGet(`service/${id}`);
});

export const update = createAsyncThunk('service/update', (data) => {
    return http.httpPut(`service/${data.id}`, data);
});

export const add = createAsyncThunk('service/add', (data) => {
    return http.httpPost('service', data);
});

export const upload = createAsyncThunk('service/upload', (data) => {
    return http.httpPost(`service/upload/`, data);
});

// Slice
const slice = createSlice({
    name: 'service',
    initialState: {
        services: [],
        service: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllService
        builder.addCase(getAllService.pending, (state) => {
            state.totalMoneyService = 0;
            state.loading = true;
        });
        builder.addCase(getAllService.fulfilled, (state, action) => {
            state.loading = false;
            state.services = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllService.rejected, (state, action) => {
            state.loading = false;
            state.services = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getServiceById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getServiceById.fulfilled, (state, action) => {
            state.loading = false;
            state.service = action.payload;
            state.error = '';
        });
        builder.addCase(getServiceById.rejected, (state, action) => {
            state.loading = false;
            state.service = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.services = state.services.map((item) => (item.id === action.payload.id ? action.payload : item));
            }
            state.services = state.services.filter((x) => x.status === 1);
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.services.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
