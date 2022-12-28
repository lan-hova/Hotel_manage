import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllServiceType = createAsyncThunk('service-type/getAllServiceType', () => {
    return http.httpGet('service-type');
});

export const getServiceTypeById = createAsyncThunk('service-type/getServiceTypeById', (id) => {
    return http.httpGet(`service-type/${id}`);
});

export const update = createAsyncThunk('service-type/update', (data) => {
    return http.httpPut(`service-type/${data.id}`, data);
});

export const add = createAsyncThunk('service-type/add', (data) => {
    return http.httpPost('service-type', data);
});

// Slice
const slice = createSlice({
    name: 'serviceType',
    initialState: {
        serviceTypes: [],
        serviceType: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllServiceType
        builder.addCase(getAllServiceType.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllServiceType.fulfilled, (state, action) => {
            state.loading = false;
            state.serviceTypes = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllServiceType.rejected, (state, action) => {
            state.loading = false;
            state.serviceTypes = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getServiceTypeById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getServiceTypeById.fulfilled, (state, action) => {
            state.loading = false;
            state.serviceType = action.payload;
            state.error = '';
        });
        builder.addCase(getServiceTypeById.rejected, (state, action) => {
            state.loading = false;
            state.serviceType = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.serviceTypes = state.serviceTypes.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.serviceTypes = state.serviceTypes.filter((x) => x.status === 1);
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
            state.serviceTypes.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
