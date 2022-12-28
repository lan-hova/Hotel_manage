import {
    faBuildingCircleCheck,
    faPersonWalkingArrowRight,
    faPersonWalkingLuggage,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, message, Modal } from 'antd';
import { useState, React } from 'react'
import MonthlyCalendarRoom from '../Calendar/MonthlyCalendar';
import axios from 'axios';
import Loading from './../../../Loading/loading';
import { toast } from 'react-toastify';

const { confirm } = Modal;


const Room = ({ 
    room,
    optionType,
    setOpenModalListRoom,
    dateChoose,
    dataBooking,
    setDataBooking,
    dataBill,
    setDataBill,
    roomBookingList,
    setRoomBookingList,
    updateRoomPlan,
    extraRoom,
    listRoomChoose,
}) => {

    //Data
    const [openCalendar, setOpenCalendar] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const key = 'messageApi';
    const [messageApi, contextHolder] = message.useMessage();
    const [listDetailInvoice, setListDetailInvoice] = useState();
    const [isLoading, setIsLoading] = useState(false);
    //End Data

    //Created
    //End Created

    //Gen Data
    const genDetailInvoice = () => {
        let data = null;
        if(room.detailInvoiceList) {
            data = room.detailInvoiceList.find(element => element.status === 1);
        }
        return data;
    }
    const genBooking = () => {
        let data = null;
        if(room.detailInvoiceList) {
            data = room.detailInvoiceList;
            data = data.filter((x) => x.status === 3);
        }
        return data;
    }

    //End Gen Data

    //Function
    const getAllDetailInVoiceByRoom = async () => {
        let data = null;
        await axios
            .get('http://localhost:8080/api/room-rental-manage/all-detail-invoice-by-room-and-status/' + room.rooms.id)
            .then(res => {
                data = res.data;
                setListDetailInvoice(res.data);
            }).catch(err => {});
        return data;
    }

    const getAllDetailInVoiceByRoomAndDate = async () => {
        let data = null;
        await axios
            .get('http://localhost:8080/api/room-rental-manage/all-detail-invoice-by-room-and-status-and-date/' + room.rooms.id + "/" + dateChoose)
            .then(res => {
                data = res.data;
                setListDetailInvoice(res.data);
            }).catch(err => {});
        return data;
    }

    const confirm = async (data) => {
        setIsLoading(true);
        if(optionType === "BOOKING") {
            const params = {
                rooms: data.room,
                bills: dataBill || null,
                booking: {
                    ...dataBooking,
                    bookingStatus: 2,
                },
                hireDate: data.hireDate + " " + window.localStorage.getItem("time-in"),
                checkOutDay: data.checkOutDay + " " + window.localStorage.getItem("time-out"),
                userNamePersonnel: window.localStorage.getItem("username"),
            }
            await axios
                .post('http://localhost:8080/api/booking/booking-room', params)
                .then((res) => {
                    setDataBill(res.data.bills);
                    setRoomBookingList([
                        ...roomBookingList,
                        res.data.detailsInvoice
                    ])
                    setOpenCalendar(false);
                    setOpenModalListRoom(false);
                    updateRoomPlan();
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 500);
                    toast.success('Xếp phòng thành công', { autoClose: 2000 });
                })
                .catch((err) => {});
        }
        if(optionType === "CHECK-IN/EXTRA-ROOM") {
            extraRoom(data);
            setOpenCalendar(false);
            setOpenModalListRoom(false);
        }
        
    }

    const checkRoom = async () => {
        let check = true;
        let listDetailInvoiceCheck = await getAllDetailInVoiceByRoomAndDate();
        // let listDetailInvoiceBookingCheck = listDetailInvoiceCheck.filter((x) => x.status === 3);
        if(listDetailInvoiceCheck.length > 1) {
            check = false;
        } else {
            let detailInvoiceBookingCheck = listDetailInvoiceCheck.find((x) => x.status === 3);
            let detailInvoiceCheck = listDetailInvoiceCheck.find((x) => x.status === 1);
            if(detailInvoiceBookingCheck) {
                check = false;
                if(detailInvoiceBookingCheck.checkOutDay.split(" ")[0] === dateChoose) {
                    console.log("có");
                    check = true;
                }
            }
            if(detailInvoiceCheck) {
                check = false;
                if(detailInvoiceCheck.checkOutDay.split(" ")[0] === dateChoose) {
                    check = true;
                }
            }
        }
        return check;
    }

    const checkListRoomChoose = () => {
        let check = true;
        if(listRoomChoose) {
            if(listRoomChoose.find((x) => x.rooms.id === room.rooms.id)) {
                check = false;
            }
        }
        return check;
    }
    //End Function

    //Util
    const formatCurrency = (value) => {
        return value.toLocaleString(
            'it-IT', 
            {
                style : 'currency',
                currency : 'VND'
            }
        );
    };
    //End Util

    return (
        <> 
            {contextHolder}
            {isLoading && (<Loading></Loading>)}
            <div
                onClick={
                    () => {
                        if(checkListRoomChoose()) {
                            checkRoom().then(
                                (res) => {
                                    if(res) {
                                        getAllDetailInVoiceByRoom();
                                        setOpenCalendar(true);
                                    }
                                }
                            )
                        }
                    }
                }
                className=' border border-1 text-base p-3 cursor-pointer hover:bg-default-2 hover:border-design-greenLight'
            >

                <div className='flex justify-end font-semibold'>
                    <span className='text-base font-semibold'>
                        {room.rooms.name}
                    </span>
                </div>

                <div className='flex justify-end font-semibold'>
                    {room.rooms.kindOfRoom.name}
                </div>

                <div className={`flex items-center pt-10`}>
                    
                    <span
                        className={`px-3 py-1 rounded-full text-white
                            ${room.rooms.statusByDate === 1 ? "bg-design-greenLight" : ""}
                            ${room.rooms.statusByDate === 2 ? "bg-status-2" : ""}
                            ${room.rooms.statusByDate === 3 ? "bg-status-3" : ""}`
                        }
                    >
                        {room.rooms.statusByDate === 1 && "Sẵn sàng đón khách"}
                        {room.rooms.statusByDate === 2 && "Đang có khách"}
                        {room.rooms.statusByDate === 3 && "Đang dọn dẹp"}
                    </span>

                    <span className='ml-3'>
                        {genDetailInvoice() && genDetailInvoice().bills.customer.fullname}
                    </span>

                </div>

                {genDetailInvoice() && (
                    <>
                        <div className='grid grid-cols-2 pt-3'>
                            <div className='flex items-center'>
                                <span className='rounded-full bg-design-charcoalblack h-7 w-7 text-white p-3 flex justify-center items-center'>
                                    <FontAwesomeIcon
                                        icon={faPersonWalkingArrowRight}
                                        className="w-[18px] h-[18px]"
                                    ></FontAwesomeIcon>
                                </span>
                                <span className='ml-3'>
                                    {genDetailInvoice() && genDetailInvoice().hireDate}
                                </span>
                            </div>
                            <div className='flex items-center'>
                                <span className='rounded-full bg-design-charcoalblack h-7 w-7 text-white p-3 flex justify-center items-center'>
                                    <FontAwesomeIcon
                                        icon={faBuildingCircleCheck}
                                        className="w-[18px] h-[18px]"
                                    ></FontAwesomeIcon>
                                </span>
                                <span className='ml-3'>
                                    {genDetailInvoice() && genDetailInvoice().checkOutDay}
                                </span>
                            </div>
                        </div>
                    </>
                )}
                {genBooking() && genBooking().map(
                    (x) => (
                        <div>
                            <Divider style={{margin: 12}}/>
                            <div className={`flex items-center w-full`}>
                                <span className={`px-3 py-1 rounded-full text-white bg-status-4`}>
                                    Khách đặt trước
                                </span>
                                <span className='ml-3'>
                                    {x.bills.customer.fullname}
                                </span> 
                            </div>
                            <div className='flex items-center mt-3'>
                                <span className='rounded-full bg-design-charcoalblack h-7 w-7 text-white p-3 flex justify-center items-center'>
                                    <FontAwesomeIcon
                                        icon={faPersonWalkingLuggage}
                                        className="w-[18px] h-[18px]"
                                    ></FontAwesomeIcon>
                                </span>
                                <span className='ml-3'>
                                    {x.hireDate}
                                </span>
                            </div>
                            <div className='flex items-center mt-3'>
                                <span className='rounded-full bg-design-charcoalblack h-7 w-7 text-white p-3 flex justify-center items-center'>
                                    <FontAwesomeIcon
                                        icon={faPersonWalkingArrowRight}
                                        className="w-[18px] h-[18px]"
                                    ></FontAwesomeIcon>
                                </span>
                                <span className='ml-3'>
                                    {x.checkOutDay}
                                </span>
                            </div>
                        </div>
                    )
                )}
            </div>
            <MonthlyCalendarRoom
                openCalendar={openCalendar}
                setOpenCalendar={setOpenCalendar}
                roomId={room.rooms.id}
                listDetailInvoice={listDetailInvoice}
                dateChoose={dateChoose}
                room={room}
                okBtn={confirm}
            ></MonthlyCalendarRoom>
        </>
    );
}

export default Room;
