import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllNationality = createAsyncThunk('nationality/getAllNationality', () => {
    return http.httpGet('nationality');
});

export const getNationalityById = createAsyncThunk('nationality/getNationalityById', (id) => {
    return http.httpGet(`nationality/${id}`);
});

export const update = createAsyncThunk('Nationality/update', (data) => {
    return http.httpPut(`nationality/${data.id}`, data);
});

export const add = createAsyncThunk('nationality/add', (data) => {
    return http.httpPost('nationality', data);
});

// Slice
const slice = createSlice({
    name: 'Nationality',
    initialState: {
        nationalitys: [],
        nationality: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllServiceType
        builder.addCase(getAllNationality.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllNationality.fulfilled, (state, action) => {
            state.loading = false;
            state.nationalitys = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllNationality.rejected, (state, action) => {
            state.loading = false;
            state.nationalitys = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getNationalityById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getNationalityById.fulfilled, (state, action) => {
            state.loading = false;
            state.nationality = action.payload;
            state.error = '';
        });
        builder.addCase(getNationalityById.rejected, (state, action) => {
            state.loading = false;
            state.nationality = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.nationalitys = state.nationalitys.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.nationalitys = state.nationalitys.filter((x) => x.status === 1);
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
            state.nationalitys.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
