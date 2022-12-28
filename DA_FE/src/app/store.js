import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// reducers
import personnel from './reducers/personnel';
import service from './reducers/service';
import serviceType from './reducers/serviceType';
import handOver from './reducers/handOver';
import facility from './reducers/facilities';
import facilityDetail from './reducers/facilityDetail';
import rentalType from './reducers/rentalType';
import numberOfFloor from './reducers/numberOfFloor';
import handOverBill from './reducers/handOverBill';
import nationality from './reducers/nationality';
import kindOfRoom from './reducers/kindOfRoom';
import room from './reducers/room';
import chart from './reducers/chart';
import user from './reducers/user';
import history from './reducers/history';
import authority from './reducers/authority';
import resetHandOver from './reducers/resetHandOver';
import customer from './reducers/customer';
import serviceAvailable from './reducers/serviceAvailable';
import serviceDetail from './reducers/serviceDetail';
import booking from './reducers/booking';
import facilityy from './reducers/facility';
import detailsInvoice from './reducers/detailsInvoice';

const reducer = combineReducers({
    // here we will be adding reducers
    personnel: personnel,
    service: service,
    facility: facility,
    facilityDetail: facilityDetail,
    serviceType: serviceType,
    numberOfFloor: numberOfFloor,
    room: room,
    chart: chart,
    user: user,
    detailsInvoice: detailsInvoice,
    history: history,
    authority: authority,
    kindOfRoom: kindOfRoom,
    handOver: handOver,
    rentalType: rentalType,
    nationality: nationality,
    handOverBill: handOverBill,
    resetHandOver: resetHandOver,
    customer: customer,
    serviceAvailable: serviceAvailable,
    serviceDetail: serviceDetail,
    booking: booking,
    facilityy: facilityy,
});
const store = configureStore({
    reducer,
});
export default store;
