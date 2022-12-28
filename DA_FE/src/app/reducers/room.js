import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllRoom = createAsyncThunk('room/getAllRoom', () => {
    return http.httpGet('room');
});

export const addRoom = createAsyncThunk('room/addRoom', (data) => {
    return http.httpPost('room', data);
});

export const UpdateRoom = createAsyncThunk('room/UpdateRoom', (data) => {
    return http.httpPut(`room/${data.id}`, data);
});

export const addRoomOption = createAsyncThunk('room/addRoomOption', (data) => {
    return http.httpPost(`room/Option/${data.sl}`, data.roomAdd);
});

export const getRoomById = createAsyncThunk('room/getRoomById', (id) => {
    return http.httpGet(`room/${id}`);
});

export const deleteById = createAsyncThunk('room/deleteById', (data) => {
    return http.httpDelete('room', data);
});


// Slice
const slice = createSlice({
    name: 'room',
    initialState: {
        rooms: [],
        room: {},
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {

        builder.addCase(getAllRoom.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllRoom.fulfilled, (state, action) => {
            state.loading = false;
            state.rooms = action.payload;
            state.error = '';
        });
        builder.addCase(getAllRoom.rejected, (state, action) => {
            state.loading = false;
            state.rooms = [];
            state.error = action.error.message;
        });

        //deleteById
        // builder.addCase(deleteById.pending, (state) => {
        //     state.loading = true;
        // });
        // builder.addCase(deleteById.fulfilled, (state, action) => {
        //     state.loading = false;
        //     if (action.payload.id) {
        //         state.addRoom = state.addRoom.filter((item) => item.id !== action.payload.id);
        //     }
        // });
        // builder.addCase(deleteById.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.error.message;
        // });

        builder.addCase(UpdateRoom.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(UpdateRoom.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.id) {
                state.rooms = state.rooms.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                );
            }
            state.rooms = state.rooms.filter((x) => x.status === 1);
        });
        builder.addCase(UpdateRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // getById
        builder.addCase(getRoomById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getRoomById.fulfilled, (state, action) => {
            state.loading = false;
            state.room = action.payload;
            state.error = '';
        });
        builder.addCase(getRoomById.rejected, (state, action) => {
            state.loading = false;
            state.room = {};
            state.error = action.error.message;
        });

        // add Room
        builder.addCase(addRoom.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addRoom.fulfilled, (state, action) => {
            state.loading = false;
            state.rooms.push(action.payload);
        });
        builder.addCase(addRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
