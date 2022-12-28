import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllResetHandOver = createAsyncThunk('reset-hand-over/getAllResetHandOver', () => {
    return http.httpGet('reset-hand-over');
});

export const add = createAsyncThunk('reset-hand-over/add', (data) => {
    return http.httpPost('reset-hand-over', data);
});

// Slice
const slice = createSlice({
    name: 'resetHandOver',
    initialState: {
        resetHandOvers: [],
        resetMoneyFromUserLogin: 0,
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllResetHandOver
        builder.addCase(getAllResetHandOver.pending, (state) => {
            state.resetMoneyFromUserLogin = 0;
            state.loading = true;
        });
        builder.addCase(getAllResetHandOver.fulfilled, (state, action) => {
            const now = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 19);
            const dateOfLogin = '2022-10-13T00:00:00';
            state.loading = false;
            state.resetHandOvers = action.payload;
            state.resetHandOvers
                .filter((x) => dateOfLogin <= x.dateTimeStart && x.dateTimeEnd <= now)
                .map((x) => (state.resetMoneyFromUserLogin += x.handMoney));
            state.error = '';
        });
        builder.addCase(getAllResetHandOver.rejected, (state, action) => {
            state.loading = false;
            state.resetHandOvers = [];
            state.error = action.error.message;
        });

        // add personnel
        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.resetHandOvers.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
