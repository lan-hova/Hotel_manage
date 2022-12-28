import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

export const adds = createAsyncThunk('ServiceAvailable/createServiceAvailable', (data) => {
    return http.httpPosts(`service-available/${data.id}/${data.sl}`);
});

export const addsvOption = createAsyncThunk('ServiceAvailable/addsvOption', (data) => {
    return http.httpPosts(`service-available/Option/${data.id}/${data.sl}`);
});

export const getByRoomIdSv = createAsyncThunk('service-available/getByRoomId', (id) => {
    return http.httpGet(`service-available/room/${id}`);
});

export const UpdateServiceAvailables = createAsyncThunk('room/UpdateRoom', (data) => {
    return http.httpPut(`service-available/${data.id}`, data);
});

export const addsv = createAsyncThunk('service-available/addsv', (data) => {
    return http.httpPost('service-available', data);
});

// Slice
const slice = createSlice({
    name: 'serviceAvailable',
    initialState: {
        ServiceAvailables: [],
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {

        //getByRoomIdSv
        builder.addCase(getByRoomIdSv.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getByRoomIdSv.fulfilled, (state, action) => {
            state.loading = false;
            state.ServiceAvailables = action.payload;
            state.error = '';
        });
        builder.addCase(getByRoomIdSv.rejected, (state, action) => {
            state.loading = false;
            state.ServiceAvailables = [];
            state.error = action.error.message;
        });


        builder.addCase(UpdateServiceAvailables.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(UpdateServiceAvailables.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.ServiceAvailables = state.ServiceAvailables.map((item) => (item.id === action.payload.id ? action.payload : item));
            }
            state.ServiceAvailables = state.ServiceAvailables.filter((x) => x.status === 1);
        });
        builder.addCase(UpdateServiceAvailables.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(addsv.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addsv.fulfilled, (state, action) => {
            state.loading = false;
            state.ServiceAvailables.push(action.payload);
        });
        builder.addCase(addsv.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
