import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllKindOfRoom = createAsyncThunk('KindOfRoom/getAllKindOfRoom', () => {
    return http.httpGet('kind-of-room');
});

export const getKindOfRoomById = createAsyncThunk('KindOfRoom/getKindOfRoomById', (id) => {
    return http.httpGet(`kind-of-room/${id}`);
});

export const update = createAsyncThunk('KindOfRoom/update', (data) => {
    return http.httpPut(`kind-of-room/${data.id}`, data);
});

export const add = createAsyncThunk('KindOfRoom/add', (data) => {
    return http.httpPost('kind-of-room', data);
});

export const upload = createAsyncThunk('KindOfRoom/upload', (data) => {
    return http.httpPost(`kind-of-room/upload/`, data);
});

// Slice
const slice = createSlice({
    name: 'kindOfRoom',
    initialState: {
        kindOfRoom: [],
        kindRoom: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllPersonnel
        builder.addCase(getAllKindOfRoom.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllKindOfRoom.fulfilled, (state, action) => {
            state.loading = false;
            state.kindOfRoom = action.payload;
            state.error = '';
        });
        builder.addCase(getAllKindOfRoom.rejected, (state, action) => {
            state.loading = false;
            state.kindOfRoom = [];
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getKindOfRoomById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getKindOfRoomById.fulfilled, (state, action) => {
            state.loading = false;
            state.kindRoom = action.payload;
            state.error = '';
        });
        builder.addCase(getKindOfRoomById.rejected, (state, action) => {
            state.loading = false;
            state.kindRoom = {};
            state.error = action.error.message;
        });

        // update
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.kindOfRoom = state.kindOfRoom.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.kindOfRoom = state.kindOfRoom.filter((x) => x.status === 1);
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
            state.kindOfRoom.push(action.payload);
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
