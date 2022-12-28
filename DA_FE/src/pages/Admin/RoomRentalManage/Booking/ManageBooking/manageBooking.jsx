import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import Cancel from "./BookingByStatus/cancel";
import Paid from './BookingByStatus/paid';
import UnPaid from "./BookingByStatus/unpaid";
import { useEffect, useState } from 'react';
import axios from "axios";

function ManageBooking() {

    const [listBookingPaid, setListBookingPaid] = useState();
    const [listBookingUnPaid, setListBookingUnPaid] = useState();
    const [listBookingCancel, setListBookingCancel] = useState();

    useEffect(()=> {
        getListBookingPaid();
        getListBookingUnPaid();
        getListBookingCancel();
    }, [])

    const getListBookingPaid = async () => {
        await axios
            .get('http://localhost:8080/api/booking/get-list-booking-paid')
            .then(res => {
                setListBookingPaid(res.data);
            })
            .catch(err => {});
    }
    const getListBookingUnPaid = async () => {
        await axios
            .get('http://localhost:8080/api/booking/get-list-booking-unpaid')
            .then(res => {
                setListBookingUnPaid(res.data);
            })
            .catch(err => {});
    }

    const getListBookingCancel = async () => {
        await axios
            .get('http://localhost:8080/api/booking/get-list-booking-cancel')
            .then(res => {
                setListBookingCancel(res.data);
            })
            .catch(err => {});
    }

    return (
        <>
            <div className="text-lg font-semibold">Quản lý Booking</div>
            <Tabs defaultActiveKey="1" size="large">
                    <TabPane tab="Đã thanh toán" key="1" className="text-base">
                        <Paid listBookingPaid={listBookingPaid} setListBookingPaid={setListBookingPaid} getListBookingPaid={getListBookingPaid} getListBookingUnPaid={getListBookingUnPaid} getListBookingCancel={getListBookingCancel}></Paid>
                    </TabPane>
                    <TabPane tab="Chưa thanh toán" key="2" className="text-base">
                        <UnPaid listBookingUnPaid={listBookingUnPaid} setListBookingUnPaid={setListBookingUnPaid} getListBookingPaid={getListBookingPaid} getListBookingUnPaid={getListBookingUnPaid} getListBookingCancel={getListBookingCancel}></UnPaid>
                    </TabPane>
                    <TabPane tab="Đã hủy" key="3" className="text-base">
                        <Cancel listBookingCancel={listBookingCancel} setListBookingCancel={setListBookingCancel} getListBookingPaid={getListBookingPaid} getListBookingUnPaid={getListBookingUnPaid} getListBookingCancel={getListBookingCancel}></Cancel>
                    </TabPane>
            </Tabs>
        </>
    );
}

export default ManageBooking;