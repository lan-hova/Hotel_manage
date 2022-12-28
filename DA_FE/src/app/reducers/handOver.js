import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllHandOver = createAsyncThunk('hand-over/getAllHandOver', () => {
    return http.httpGet('hand-over');
});

export const getHandOverById = createAsyncThunk('service/getHandOverById', (id) => {
    return http.httpGet(`hand-over/${id}`);
});

export const update = createAsyncThunk('hand-over/update', (data) => {
    return http.httpPut(`hand-over/${data.id}`, data);
});

export const add = createAsyncThunk('hand-over/add', (data) => {
    return http.httpPost('hand-over', data);
});

// Slice
const slice = createSlice({
    name: 'handOver',
    initialState: {
        handOvers: [],
        handOver: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllHandOver
        builder.addCase(getAllHandOver.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllHandOver.fulfilled, (state, action) => {
            state.loading = false;
            state.handOvers = action.payload;
            state.error = '';
        });
        builder.addCase(getAllHandOver.rejected, (state, action) => {
            state.loading = false;
            state.handOvers = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getHandOverById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getHandOverById.fulfilled, (state, action) => {
            state.loading = false;
            state.handOver = action.payload;
            state.error = '';
        });
        builder.addCase(getHandOverById.rejected, (state, action) => {
            state.loading = false;
            state.handOver = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.handOvers = state.handOvers.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // add personnel
        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.handOvers.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
