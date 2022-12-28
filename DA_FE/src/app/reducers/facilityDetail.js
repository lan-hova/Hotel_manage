import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';
export const addf = createAsyncThunk('facility-detail/createNewFacilityDetail', (id) => {
    return http.httpPosts(`facility-detail/${id}`);
});

export const add = createAsyncThunk('facility-detail/addNewFacilityDetails', (data) => {
    console.log(data);
    return http.httpPost('facility-detail', data);
});

export const getByRoomId = createAsyncThunk('facility-detail/getByRoomId', (id) => {
    return http.httpGet(`facility-detail/room/${id}`);
});

export const addByIdOption = createAsyncThunk('facility-detail/getByRoomIdOption', (id) => {
    return http.httpPosts(`facility-detail/option/${id}`);
});

export const fddeleteById = createAsyncThunk('facility-detail/fddeleteById', (id) => {
    return http.httpDelete(`facility-detail`, id);
});

const slice = createSlice({
    name: 'facilityDetail',
    initialState: {
        facilityDetail: [],
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getByRoomId.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getByRoomId.fulfilled, (state, action) => {
            state.loading = false;
            state.facilityDetail = action.payload;
            state.error = '';
        });
        builder.addCase(getByRoomId.rejected, (state, action) => {
            state.loading = false;
            state.facilityDetail = [];
            state.error = action.error.message;
        });

        builder.addCase(add.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            state.loading = false;
            state.facilityDetail.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default slice.reducer;
