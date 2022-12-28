import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import http from '~/services/apiSevices';

export const getAllFacility = createAsyncThunk('facility/getAllFacility', () => {
    return http.httpGet('facility');
});
const slice = createSlice({
    name: 'facility',
    initialState: {
        facilities: [],
        error: '',
        loading: false,
    },
    extraReducers: (builder) => {
        // getAllPersonnel
        builder.addCase(getAllFacility.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllFacility.fulfilled, (state, action) => {
            state.loading = false;
            state.facilities = action.payload;
            state.error = '';
        });
        builder.addCase(getAllFacility.rejected, (state, action) => {
            state.loading = false;
            state.facilities = [];
            state.error = action.error.message;
        });

        // deleteById
        // builder.addCase(deleteById.pending, (state) => {
        //     state.loading = true;
        // });
        // builder.addCase(deleteById.fulfilled, (state, action) => {
        //     state.loading = false;
        //     if (action.payload.id) {
        //         state.personnel = state.personnel.filter((item) => item.id !== action.payload.id);
        //     }
        // });
        // builder.addCase(deleteById.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.error.message;
        // });
    },
});

export default slice.reducer;
