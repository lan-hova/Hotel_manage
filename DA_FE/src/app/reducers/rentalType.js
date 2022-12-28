import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllRentalTypes = createAsyncThunk('rental-type/getAllRentalTypes', () => {
    return http.httpGet('rental-type');
});

export const getRentalTypeById = createAsyncThunk('rental-type/getRentalTypeById', (id) => {
    return http.httpGet(`rental-type/${id}`);
});

export const update = createAsyncThunk('rental-type/update', (data) => {
    return http.httpPut(`rental-type/${data.id}`, data);
});

export const add = createAsyncThunk('rental-type/add', (data) => {
    return http.httpPost('rental-type', data);
});

// Slice
const slice = createSlice({
    name: 'rentalType',
    initialState: {
        rentalTypes: [],
        rentalType: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllRentalTypes
        builder.addCase(getAllRentalTypes.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllRentalTypes.fulfilled, (state, action) => {
            state.loading = false;
            state.rentalTypes = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllRentalTypes.rejected, (state, action) => {
            state.loading = false;
            state.rentalTypes = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getRentalTypeById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getRentalTypeById.fulfilled, (state, action) => {
            state.loading = false;
            state.rentalType = action.payload;
            state.error = '';
        });
        builder.addCase(getRentalTypeById.rejected, (state, action) => {
            state.loading = false;
            state.rentalType = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.rentalTypes = state.rentalTypes.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.rentalTypes = state.rentalTypes.filter((x) => x.status === 1);
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // add
        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.rentalTypes.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
