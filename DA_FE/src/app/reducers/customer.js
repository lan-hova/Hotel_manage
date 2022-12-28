import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllCustomer = createAsyncThunk('customer/getAllCustomer', () => {
    return http.httpGet('customer');
});

export const getAllNationality = createAsyncThunk('customer/getAllNationality', () => {
    return http.httpGet('nationality');
});

export const getCustomerById = createAsyncThunk('customer/getCustomerById', (id) => {
    return http.httpGet(`customer/${id}`);
});

export const getCustomerByNameUser = createAsyncThunk('customer/getCustomerByNameUser', (name) => {
    return http.httpGet(`customer/nameUser/${name}`);
});

export const update = createAsyncThunk('customer/update', (data) => {
    return http.httpPut(`customer/${data.id}`, data);
});

export const add = createAsyncThunk('customer/add', (data) => {
    return http.httpPost('customer', data);
});

// Slice
const slice = createSlice({
    name: 'customer',
    initialState: {
        nationalities: [],
        customers: [],
        customer: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllCustomer
        builder.addCase(getAllCustomer.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.customers = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllCustomer.rejected, (state, action) => {
            state.loading = false;
            state.customers = [];
            state.error = action.error.message;
        });

        // getAllNationality
        builder.addCase(getAllNationality.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllNationality.fulfilled, (state, action) => {
            state.loading = false;
            state.nationalities = action.payload;
            state.error = '';
        });
        builder.addCase(getAllNationality.rejected, (state, action) => {
            state.loading = false;
            state.nationalities = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getCustomerById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCustomerById.fulfilled, (state, action) => {
            state.loading = false;
            state.customer = action.payload;
            state.error = '';
        });
        builder.addCase(getCustomerById.rejected, (state, action) => {
            state.loading = false;
            state.customer = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.customers = state.customers.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.customers = state.customers.filter((x) => x.status === 1);
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // add customer
        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.customers.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });


        builder.addCase(getCustomerByNameUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCustomerByNameUser.fulfilled, (state, action) => {
            state.loading = false;
            state.customer = action.payload;
            state.error = '';
        });
        builder.addCase(getCustomerByNameUser.rejected, (state, action) => {
            state.loading = false;
            state.customer = {};
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
