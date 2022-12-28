import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllFacilities = createAsyncThunk('facility/getAllFacilities', () => {
    return http.httpGet('facility');
});

export const getFacilitiesById = createAsyncThunk('facility/getFacilitiesById', (id) => {
    return http.httpGet(`facility/${id}`);
});

export const update = createAsyncThunk('facility/update', (data) => {
    return http.httpPut(`facility/${data.id}`, data);
});

export const add = createAsyncThunk('facility/add', (data) => {
    return http.httpPost('facility', data);
});

// Slice
const slice = createSlice({
    name: 'facility',
    initialState: {
        facilities: [],
        facility: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllFacilities
        builder.addCase(getAllFacilities.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllFacilities.fulfilled, (state, action) => {
            state.loading = false;
            state.facilities = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllFacilities.rejected, (state, action) => {
            state.loading = false;
            state.facilities = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getFacilitiesById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getFacilitiesById.fulfilled, (state, action) => {
            state.loading = false;
            state.facility = action.payload;
            state.error = '';
        });
        builder.addCase(getFacilitiesById.rejected, (state, action) => {
            state.loading = false;
            state.facility = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.facilities = state.facilities.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.facilities = state.facilities.filter((x) => x.status === 1);
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
            state.facilities.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;