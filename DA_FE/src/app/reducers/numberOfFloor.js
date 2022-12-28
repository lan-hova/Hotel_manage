import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllNumberOfFloors = createAsyncThunk('numberOfFloors/getAllNumberOfFloors', () => {
    return http.httpGet('number-of-floor');
});

export const getByIdNumberOfFloors = createAsyncThunk('numberOfFloors/getByIdNumberOfFloors', (id) => {
    return http.httpGet(`number-of-floor/${id}`);
});

export const getByIdNumberOfFloorslast = createAsyncThunk('numberOfFloors/getByIdNumberOfFloorslast', () => {
    return http.httpGet(`number-of-floor/last`);
});

export const AddNBF = createAsyncThunk('numberOfFloors/AddNBF', (data) => {
    return http.httpPost('number-of-floor', data);
});

export const AddNBFop = createAsyncThunk('numberOfFloors/AddNBF', (data) => {
    return http.httpPost(`number-of-floor/${data.sl}`, data.NumberOfFloorss);
});

export const update = createAsyncThunk('number-of-floor/update', (data) => {
    return http.httpPut(`number-of-floor/${data.id}`, data);
});

export const upload = createAsyncThunk('numberOfFloors/upload', (data) => {
    return http.httpPost(`number-of-floor/upload/`, data);
});

// Slice
const slice = createSlice({
    name: 'numberOfFloor',
    initialState: {
        numberOfFloors: [],
        NumberOfFloor: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllPersonnel
        builder.addCase(getAllNumberOfFloors.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllNumberOfFloors.fulfilled, (state, action) => {
            state.loading = false;
            state.numberOfFloors = action.payload;
            state.error = '';
        });
        builder.addCase(getAllNumberOfFloors.rejected, (state, action) => {
            state.loading = false;
            state.numberOfFloors = [];
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.numberOfFloors = state.numberOfFloors.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.numberOfFloors = state.numberOfFloors.filter((x) => x.status === 1);
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(getByIdNumberOfFloors.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getByIdNumberOfFloors.fulfilled, (state, action) => {
            state.loading = false;
            state.NumberOfFloor = action.payload;
            state.error = '';
        });
        builder.addCase(getByIdNumberOfFloors.rejected, (state, action) => {
            state.loading = false;
            state.NumberOfFloor = {};
            state.error = action.error.message;
        });

        builder.addCase(AddNBF.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(AddNBF.fulfilled, (state, action) => {
            state.loading = false;
            state.numberOfFloors.push(action.payload);
        });
        builder.addCase(AddNBF.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(getByIdNumberOfFloorslast.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getByIdNumberOfFloorslast.fulfilled, (state, action) => {
            state.loading = false;
            state.NumberOfFloor = action.payload;
            state.error = '';
        });
        builder.addCase(getByIdNumberOfFloorslast.rejected, (state, action) => {
            state.loading = false;
            state.NumberOfFloor = {};
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
