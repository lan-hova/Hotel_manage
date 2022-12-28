import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllHistory = createAsyncThunk('history/getAllHistory', () => {
    return http.httpGet('history');
});

export const getHistoryById = createAsyncThunk('history/getHistoryById', (id) => {
    return http.httpGet(`history/${id}`);
});

export const update = createAsyncThunk('history/update', (data) => {
    return http.httpPut(`history/${data.id}`, data);
});

export const add = createAsyncThunk('history/add', (data) => {
    return http.httpPost('history', data);
});

// Slice
const slice = createSlice({
    name: 'history',
    initialState: {
        histories: [],
        history: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllHistory
        builder.addCase(getAllHistory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.histories = action.payload;
            state.error = '';
        });
        builder.addCase(getAllHistory.rejected, (state, action) => {
            state.loading = false;
            state.histories = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getHistoryById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getHistoryById.fulfilled, (state, action) => {
            state.loading = false;
            state.history = action.payload;
            state.error = '';
        });
        builder.addCase(getHistoryById.rejected, (state, action) => {
            state.loading = false;
            state.history = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.histories = state.histories.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.histories = state.histories.filter((x) => x.status === 1);
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // add history
        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.histories.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
