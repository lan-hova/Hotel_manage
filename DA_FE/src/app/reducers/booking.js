import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '~/services/apiSevices';
let checkInday ='',
valueDay=0,
CheckOutday='',
idKingOfRoom =0
;
export const seachRoomBooking = createAsyncThunk('booking/seachRoomBooking', (data) => {
    checkInday=data.v1;
    CheckOutday=data.v2;
    idKingOfRoom=data.v3;
    valueDay=data.v4;
    return http.httpGet(`booking/${data.v1}/${data.v2}/${data.v3}/${data.v4}`);
});

export const addboking = createAsyncThunk('booking/addboking', (data) => {
    return http.httpPosts(`booking/${data.v1}/${data.v2}/${data.v3}/${data.v4}`);
});

export const getAllBookingByStatus = createAsyncThunk('booking/getAllBookingByStatus', () => {
    return http.httpGet('booking/status');
});

const slice = createSlice({
    name: 'booking',
    initialState: {
        roomSeach:[],
        booking:[],
        checkInday2: '',
        valueDay2: 0,
        CheckOutday2: '',
        idKingOfRoom2:0,
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {


        builder.addCase(getAllBookingByStatus.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllBookingByStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.booking = action.payload.filter((x) => x.status === 1);
            state.error = '';
        });
        builder.addCase(getAllBookingByStatus.rejected, (state, action) => {
            state.loading = false;
            state.booking = [];
            state.error = action.error.message;
        });


        builder.addCase(seachRoomBooking.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(seachRoomBooking.fulfilled, (state, action) => {
            state.loading = false;
            state.checkInday2 = checkInday;
            state.valueDay2 = valueDay;
            state.CheckOutday2 = CheckOutday;
            state.idKingOfRoom2 = idKingOfRoom;
            state.roomSeach = action.payload;
            state.error = '';
        });
        builder.addCase(seachRoomBooking.rejected, (state, action) => {
            state.loading = false;
            state.roomSeach = [];
            state.error = action.error.message;
        });

        builder.addCase(addboking.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addboking.fulfilled, (state, action) => {
            state.loading = false;
            state.booking.push(action.payload);
        });
        builder.addCase(addboking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;