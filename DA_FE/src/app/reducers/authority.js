import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllAuthority = createAsyncThunk('authority/getAllAuthority', () => {
    return http.httpGet('authority');
});

export const getAuthorityById = createAsyncThunk('authority/getAuthorityById', (id) => {
    return http.httpGet(`authority/${id}`);
});

export const update = createAsyncThunk('authority/update', (data) => {
    console.log(data);
    return http.httpPut(`authority/${data.id}`, data);
});

export const add = createAsyncThunk('authority/add', (data) => {
    return http.httpPost('authority', data);
});

// Slice
const slice = createSlice({
    name: 'authority',
    initialState: {
        authorities: [],
        authority: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllAuthority
        builder.addCase(getAllAuthority.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllAuthority.fulfilled, (state, action) => {
            state.loading = false;
            state.authorities = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllAuthority.rejected, (state, action) => {
            state.loading = false;
            state.authorities = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getAuthorityById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAuthorityById.fulfilled, (state, action) => {
            state.loading = false;
            state.authority = action.payload;
            state.error = '';
        });
        builder.addCase(getAuthorityById.rejected, (state, action) => {
            state.loading = false;
            state.authority = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.authorities = state.authorities.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.authorities = state.authorities.filter((x) => x.status === 1);
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // add authority
        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.authorities.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
