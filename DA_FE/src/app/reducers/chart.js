import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

// Generates pending, fulfilled and rejected action types

export const getAllRoom = createAsyncThunk('room/getAllRoom', () => {
    return http.httpGet('room');
});

export const getAllBill = createAsyncThunk('bill/getAllHandOver', () => {
    return http.httpGet('bill');
});

// Slice
const slice = createSlice({
    name: 'char',
    initialState: {
        rangeTime: {},
        rooms: [],
        byRangeHourseData: [
            {
                time: '0h - 4h',
                quantity: 0,
            },
            {
                time: '4h - 6h',
                quantity: 0,
            },
            {
                time: '6h - 8h',
                quantity: 0,
            },
            {
                time: '8h - 10h',
                quantity: 0,
            },
            {
                time: '10h - 12h',
                quantity: 0,
            },
            {
                time: '12h - 14h',
                quantity: 0,
            },
            {
                time: '14h - 16h',
                quantity: 0,
            },
            {
                time: '16h - 18h',
                quantity: 0,
            },
            {
                time: '18h - 20h',
                quantity: 0,
            },
            {
                time: '20h - 23h59',
                quantity: 0,
            },
        ],
        bills: [],
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllRoom
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

        // getAllBill
        builder.addCase(getAllBill.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllBill.fulfilled, (state, action) => {
            state.loading = false;
            state.bills = action.payload;
            const t1 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 00:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 04:00`,
            ).length;
            const t2 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 04:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 06:00`,
            ).length;
            const t3 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 06:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 08:00`,
            ).length;
            const t4 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 08:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 10:00`,
            ).length;
            const t5 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 10:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 12:00`,
            ).length;
            const t6 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 12:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 14:00`,
            ).length;
            const t7 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 14:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 16:00`,
            ).length;
            const t8 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 16:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 18:00`,
            ).length;
            const t9 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 18:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 20:00`,
            ).length;
            const t10 = state.bills.filter(
                (x) =>
                    x.hireDate >= `${x.hireDate.slice(0, 10)} 20:00` &&
                    x.hireDate <= `${x.hireDate.slice(0, 10)} 23:59`,
            ).length;
            state.byRangeHourseData[0].quantity = t1;
            state.byRangeHourseData[1].quantity = t2;
            state.byRangeHourseData[2].quantity = t3;
            state.byRangeHourseData[3].quantity = t4;
            state.byRangeHourseData[4].quantity = t5;
            state.byRangeHourseData[5].quantity = t6;
            state.byRangeHourseData[6].quantity = t7;
            state.byRangeHourseData[7].quantity = t8;
            state.byRangeHourseData[8].quantity = t9;
            state.byRangeHourseData[9].quantity = t10;
            state.error = '';
        });
        builder.addCase(getAllBill.rejected, (state, action) => {
            state.loading = false;
            state.bills = [];
            state.error = action.error.message;
        });
    },
});
export default slice.reducer;
