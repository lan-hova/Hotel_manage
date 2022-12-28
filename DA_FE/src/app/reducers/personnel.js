import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllPersonnel = createAsyncThunk('personnel/getAllPersonnel', () => {
    return http.httpGet('personnel');
});

export const getAllNationality = createAsyncThunk('personnel/getAllNationality', () => {
    return http.httpGet('nationality');
});

export const getPersonnelById = createAsyncThunk('personnel/getPersonnelById', (id) => {
    return http.httpGet(`personnel/${id}`);
});

export const update = createAsyncThunk('personnel/update', (data) => {
    return http.httpPut(`personnel/${data.id}`, data);
});

export const add = createAsyncThunk('personnel/add', (data) => {
    return http.httpPost('personnel', data);
});

// Slice
const slice = createSlice({
    name: 'personnel',
    initialState: {
        nationalities: [],
        personnels: [],
        personnel: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllPersonnel
        builder.addCase(getAllPersonnel.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllPersonnel.fulfilled, (state, action) => {
            state.loading = false;
            state.personnels = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllPersonnel.rejected, (state, action) => {
            state.loading = false;
            state.personnels = [];
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
        builder.addCase(getPersonnelById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPersonnelById.fulfilled, (state, action) => {
            state.loading = false;
            state.personnel = action.payload;
            state.error = '';
        });
        builder.addCase(getPersonnelById.rejected, (state, action) => {
            state.loading = false;
            state.personnel = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.personnels = state.personnels.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.personnels = state.personnels.filter((x) => x.status === 1);
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
            state.personnels.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
