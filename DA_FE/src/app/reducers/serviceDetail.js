import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllServiceDetail = createAsyncThunk('service-detail/getAllServiceDetail', () => {
    return http.httpGet('service-detail');
});

// Slice
const slice = createSlice({
    name: 'serviceDetail',
    initialState: {
        serviceDetails: [],
        totalMoneyService: 0,
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllServiceDetail
        builder.addCase(getAllServiceDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllServiceDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.serviceDetails = action.payload.filter((x) => x.status === 2);
            state.serviceDetails
                .filter((x) => x.detailsInvoice.id === 2)
                .map((x) => (state.totalMoneyService += x.servicess.prices));
            state.error = '';
        });
        builder.addCase(getAllServiceDetail.rejected, (state, action) => {
            state.loading = false;
            state.serviceDetails = [];
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
