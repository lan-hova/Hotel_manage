import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment/moment';
import { useState } from 'react';
import { useEffect } from 'react';
import { MonthlyCalendar } from 'react-rainbow-components';

const MonthlyCalendarRoom = ({
    openCalendar,
    setOpenCalendar,
    roomId,
    listDetailInvoice,
    setInOut,
    dateChoose,
    room,
    okBtn,
}) => {

    //Data
    const [initialState, setInitialState] = useState({
        currentMonth: new Date(),
        selectedDate: undefined,
    });
    const [inOutCalendar, setInOutCalendar] = useState({
        hireDate: dateChoose,
        checkOutDay: "",
    });
    const [openModalComfirm, setOpenModalComfirm] = useState(false);
    // const [listDetailInvoice, setListDetailInvoice] = useState();
    //End Data

    //Created
    // useEffect(() => {
    //     getAllDetailInVoiceByRoom();
    // }, [])
    useEffect(
        () => {
            setInOutCalendar(
                {
                    ...inOutCalendar,
                    hireDate: dateChoose,
                }
            )
            setInitialState(
                {
                    ...initialState,
                    currentMonth: new Date(),
                }
            )
        }, [dateChoose]
    )
    //End Created

    //Gen Data
    const genDetailInvoice = (value) => {
        let date = moment(value).format("YYYY-MM-DD");
        let detailInvoice = null;
        if(listDetailInvoice) {
            if(listDetailInvoice.find(element => element.hireDate.split(" ")[0] <= date && date <= element.checkOutDay.split(" ")[0] && element.status === 1)){
                detailInvoice = listDetailInvoice.find(element => element.hireDate.split(" ")[0] <= date && date <= element.checkOutDay.split(" ")[0] && element.status === 1);
            }
        }
        return detailInvoice;
    }
    const genBooking = (value) => {
        let date = moment(value).format("YYYY-MM-DD");
        let booking = null;
        if(listDetailInvoice) {
            booking = listDetailInvoice;
            booking = booking.filter((x) => x.hireDate.split(" ")[0] <= date && date <= x.checkOutDay.split(" ")[0] && x.status === 3);
        }
        return booking;
    }
    const genInOut = (value, hireDate, checkOutDay) => {
        let date = moment(value).format("YYYY-MM-DD");
        let text = null;
        if(hireDate.split(" ")[0] == date) {
            text = "In " + hireDate.split(" ")[1];
        }
        if(checkOutDay.split(" ")[0] == date) {
            text = "Out " + checkOutDay.split(" ")[1];
        }
        return text;
    }
    const genSelected = (value) => {
        let date = moment(value).format("YYYY-MM-DD");
        if(inOutCalendar.hireDate == date) {
            return true;
        }
        if(inOutCalendar.hireDate <= date && inOutCalendar.checkOutDay >= date) {
            return true;
        } else {
            return false;
        }
    }
    //End Gen Data

    //Function
    // const getAllDetailInVoiceByRoom = async () => {
    //     await axios
    //         .get('http://localhost:8080/api/room-rental-manage/all-detail-invoice-by-room-and-status/' + room.rooms.id)
    //         .then(res => {
    //             setListDetailInvoice(res.data);
    //         }).catch(err => {});
    // }

    const changeInOut = (value) => {
        let date = moment(value).format("YYYY-MM-DD");
        // if(!inOutCalendar.hireDate) {
        //     setInOutCalendar({...inOutCalendar, hireDate: date})
        // }
        // if(inOutCalendar.hireDate && !inOutCalendar.checkOutDay) {
        //     setInOutCalendar({...inOutCalendar, checkOutDay: date})
        // }
        // if(inOutCalendar.hireDate && inOutCalendar.checkOutDay) {
        //     if(date > inOutCalendar.hireDate) {
        //         setInOutCalendar({...inOutCalendar, checkOutDay: date})
        //     }
        //     if(date < inOutCalendar.hireDate) {
        //         setInOutCalendar({ hireDate: date, checkOutDay: ""})
        //     }
        //     if(date == inOutCalendar.hireDate) {
        //         setInOutCalendar({ hireDate: "", checkOutDay: ""})
        //     }
        // }
        if(inOutCalendar.hireDate < date) {
            setInOutCalendar({...inOutCalendar, checkOutDay: date})
        }
    }
    
    const checkDate = (data) => {
        let check = true;
        let date = moment(data).format("YYYY-MM-DD");
        let listDetailInvoiceFilter = listDetailInvoice;
        if(listDetailInvoiceFilter) {
            listDetailInvoiceFilter = listDetailInvoiceFilter.filter((x) => x.hireDate.split(" ")[0] >= inOutCalendar.hireDate);
            if(listDetailInvoiceFilter.length > 0) {
                let minDateToList = listDetailInvoiceFilter[0].hireDate.split(" ")[0];
                listDetailInvoiceFilter.forEach(
                    (x) => {
                        if(minDateToList > x.hireDate.split(" ")[0]){
                            minDateToList = x.hireDate;
                        }
                    }
                )
                if(date >= minDateToList.split(" ")[0]) {
                    check = false;
                }
            }
        }
        return check;
    }
    //End Function

    //Util
    //End Util

    return (
        <>
            <Modal
                title={room.rooms.name}
                open={openCalendar}
                onOk={
                    () => okBtn({
                        room: room.rooms,
                        hireDate: inOutCalendar.hireDate,
                        checkOutDay: inOutCalendar.checkOutDay
                    })
                }
                onCancel={
                    () => {
                        setInOutCalendar({
                            hireDate: dateChoose,
                            checkOutDay: "",
                        })
                        setOpenCalendar(false);
                    }
                }
                okText="Xác nhận"
                cancelText="Hủy"
                width={1800}
                style={{ top: 20 }}
            >   
                <MonthlyCalendar
                    id="monthly-calendar-1"
                    currentMonth={initialState.currentMonth}
                    onMonthChange={({ month }) => setInitialState({ currentMonth: month })}
                    onSelectDate={
                        ({ date }) => {
                            if(checkDate(date)) {
                                changeInOut(date);
                            }
                        }
                    }
                    // minDate={dateChoose ? new Date(dateChoose) : new Date()}
                    dateComponent={date => (
                        <div className='px-3 pb-2 w-full h-full flex items-end'>
                            <div>
                                {genSelected(date) && (
                                    <span className='bg-design-greenLight h-5 w-5 flex justify-center items-center text-white rounded-full mb-1'>
                                        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                                    </span>
                                )}
                                {genDetailInvoice(date) &&(
                                    <div className='mb-1'>
                                        <span className='bg-status-2 px-3 rounded-full text-white'>
                                            {/* Đã có khách */}
                                            {genDetailInvoice(date).bills.customer.fullname}
                                        </span>
                                        {genInOut(date, genDetailInvoice(date).hireDate, genDetailInvoice(date).checkOutDay) && (
                                            <span className='bg-status-2 px-3 rounded-full text-white ml-1'>
                                                {genInOut(date, genDetailInvoice(date).hireDate, genDetailInvoice(date).checkOutDay)}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {/* <div>
                                    <span className='bg-design-charcoalblack px-3 rounded-full text-white'>
                                        {genDetailInvoice(date) && genDetailInvoice(date).hireDate + " - " + genDetailInvoice(date).checkOutDay}
                                    </span>
                                </div> */}
                                {genBooking(date) && genBooking(date).map(
                                    (x) => (
                                        <div className='mb-1'>
                                            <span className='bg-status-4 px-3 rounded-full text-white'>
                                                {/* Khách đặt trước */}
                                                {x.bills.customer.fullname}
                                            </span>
                                            {genInOut(date, x.hireDate, x.checkOutDay) && (
                                                <span className='bg-status-4 px-3 rounded-full text-white ml-1'>
                                                    {genInOut(date, x.hireDate, x.checkOutDay)}
                                                </span>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                />
            </Modal>
            {/* <Modal
                title="Xác nhận"
                open={openModalComfirm}
                onOk={() => okBtn()}
                onCancel={() => setOpenModalComfirm(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                style={{ top: 20 }}
            >
                <div className='py-2'>Phòng: {room.rooms.name}</div>
                <div className='py-2'>Check in: {inOutCalendar.hireDate}</div>
                <div className='py-2'>Check out: {inOutCalendar.checkOutDay}</div>
            </Modal> */}
        </>
    );
}

export default MonthlyCalendarRoom;
