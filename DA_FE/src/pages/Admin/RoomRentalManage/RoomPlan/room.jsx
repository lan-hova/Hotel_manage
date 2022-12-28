 import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import {
    faBuildingCircleCheck,
    faMoneyCheckDollar,
    faPersonWalkingArrowRight,
    faPersonWalkingLuggage,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Dropdown, message, Modal, Tooltip, Space, Button } from 'antd';
import axios from 'axios';
import { useState, React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MonthlyCalendarRoom from '../Calendar/MonthlyCalendar';
import './room.css';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Loading from '~/pages/Loading/loading';

const { confirm } = Modal;


function Room({ room, roomPlan, setRoomPlan, dateChoose }) {

    //Data
    const navigate = useNavigate();
    const dateNow = new Date();
    const [dayRental, setDayRental] = useState();
    const [hourRental, setHourRental] = useState();
    const [open, setOpen] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const key = 'messageApi';
    const [messageApi, contextHolder] = message.useMessage();
    const [listDetailInvoice, setListDetailInvoice] = useState();
    const [isLoading, setIsLoading] = useState(false);
    // const [status, getStatus] = useState(room.rooms.statusByDate);
    // const [detailInvoice, setDetailInvoice] = useState(room.detailInvoiceList.find(element => element.status === 1));
    // const [booking, setBooking] = useState(room.detailInvoiceList.find(element => element.status === 3));
    const items = [
        {
          key: '1',
          label: (
            <div
                className={`w-full`}
                onClick={
                    () => {
                        if(room.rooms.statusByDate === 1 && dateChoose == dayjs(new Date()).format('YYYY-MM-DD') && !room.detailInvoiceList.find((x) => x.status === 3)) {
                            getAllDetailInVoiceByRoom();
                            setOpenCalendar(true);
                        }
                    }
                }
            >Check in</div>
          ),
          disabled: room.rooms.statusByDate === 2 || room.rooms.statusByDate === 3 || !(dateChoose == dayjs(new Date()).format('YYYY-MM-DD')) || room.detailInvoiceList.find((x) => x.status === 3),
        },
        {
          key: '2',
          label: (
            <div
                className='w-full'
                onClick={
                    () => {
                        if(room.rooms.statusByDate === 2) {
                            navigate('/admin/rental-manage' + '/details/' + room.rooms.id);
                        }
                    }
                }
            >Chi tiết hóa đơn</div>
          ),
          disabled: room.rooms.statusByDate !== 2,
        },
        {
            key: '3',
            label: (
                <div
                    className='w-full'
                    onClick={
                        () => {
                            if(room.rooms.status === 3) {
                                setOpen(true);
                            }
                        }
                    }
                >Dọn phòng</div>
            ),
            disabled: room.rooms.status !== 3,
        },
    ];
    console.log();
    //End Data

    //Created
    useEffect(() => {
        genDayRental();
        genHourRental();
    })
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
    const genDayRental = () => {
        let detailInvoice = room.detailInvoiceList.find((x) => x.status === 1);
        if(detailInvoice) {
            let d1 = dateNow.getTime();
            let d2 = new Date(detailInvoice.hireDate).getTime();
            setDayRental(Math.ceil((d1 - d2) / (24 * 60 * 60 * 1000)));
        }
    };

    const genHourRental = () => {
        let detailInvoice = room.detailInvoiceList.find((x) => x.status === 1);
        if(detailInvoice) {
            let d1 = dateNow.getTime();
            let d2 = new Date(detailInvoice.hireDate).getTime();
            setHourRental(Math.ceil((d1 - d2) / (60 * 60 * 1000)));
        }
    };

    const getDayHireDate = () => {
        if(room.detailsInvoice && room.detailsInvoice.hireDate){
            return room.detailsInvoice.hireDate.toString().split(" ")[0];
        }
    }
    const getTimeHireDate = () => {
        if(room.detailsInvoice && room.detailsInvoice.hireDate){
            return room.detailsInvoice.hireDate.toString().split(" ")[1];
        }
    }
    const getDayCheckOutDay = () => {
        if(room.detailsInvoice && room.detailsInvoice.checkOutDay){
            return room.detailsInvoice.checkOutDay.toString().split(" ")[0];
        }
    }
    const getTimeCheckOutDay = () => {
        if(room.detailsInvoice && room.detailsInvoice.checkOutDay){
            return room.detailsInvoice.checkOutDay.toString().split(" ")[1];
        }
    }
    const genAllMoneyDetail = () => {
        let allMoney = 0;
        let detailInvoice = room.detailInvoiceList.find((x) => x.status === 1);
        if(detailInvoice && dayRental && hourRental){
            let allMoneyRoom = detailInvoice.rentalTypes.name === "Theo ngày" ? room.rooms.kindOfRoom.priceByDay * dayRental : room.rooms.kindOfRoom.hourlyPrice * hourRental;
            
            let surcharge = 0;
            let d1 = dateNow.getTime();
            let d2 = new Date(detailInvoice.checkOutDay).getTime();
            if(detailInvoice.rentalTypes.name === "Theo ngày") {
                if(d1 > d2) {
                    surcharge = allMoneyRoom * 10 / 100;
                }
            }

            let allMoneyService = 0;
            room.serviceDetailsList.forEach(element => {
                allMoneyService += element.quantity * element.servicess.prices;
            })

            allMoney = allMoneyRoom + surcharge + allMoneyService;
        }
        return allMoney;
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

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        clearTheRoom(room.rooms.id);
    };

    const handleCancel = () => {
        setOpen(false);
    };
    const clearTheRoom = async (idRoom) =>  {
        setIsLoading(true);
        // setConfirmLoading(true);
        // messageApi.open({
        //     key,
        //     type: 'loading',
        //     content: 'Vui lòng chờ...',
        // });
        await axios
            .put('http://localhost:8080/api/room-rental-manage/clear-the-room/' + idRoom)
            .then(res => { 
                    if(res) {
                        setTimeout(() => {
                            // setConfirmLoading(false);
                            setOpen(false);
                            setIsLoading(false);
                            // messageApi.open({
                            //     key,
                            //     type: 'success',
                            //     content: 'Dọn phòng thành công!',
                            //     duration: 2,
                            // });
                            toast.success('Dọn phòng thành công!', { autoClose: 2000 });
                            setRoomPlan(roomPlan.map(element => {
                                return {...element, listRoom: element.listRoom.map(element2 => {
                                    if(element2.rooms.id === idRoom){
                                        return {...element2, rooms: {...element2.rooms, status: 1, statusByDate: 1}};
                                    } else {
                                        return element2;
                                    }
                                })};
                            }))
                        }, 1000);
                    }
            })
            .catch((err) => {
                setTimeout(() => {
                    setConfirmLoading(false);
                    setOpen(false);
                    messageApi.open({
                        key,
                        type: 'error',
                        content: 'Lỗi, vui lòng kiểm tra lại!',
                        duration: 2,
                    });
                }, 1000);
            });
    }

    const checkIn = (data) => {
        if(data.hireDate && data.checkOutDay) {
            navigate('/admin/rental-manage' + '/check-in/' + room.rooms.id + "/" + data.hireDate + "/" + data.checkOutDay);
        }
    }
    //End Function

    //Util
    const formatCurrency = (value) => {
        return value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    };
    //End Util

    return (
        <> 
            {contextHolder}
            {isLoading && (<Loading></Loading>)}
            <Modal
                title={
                    <span>
                        <ExclamationCircleFilled className='text-yellow-400 mr-3'/>
                        Xác nhận phòng đã được dọn!
                    </span>
                }
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Bạn chắc chắn phòng đã được dọn rồi chứ?</p>
            </Modal>

            <div className=' border border-1 text-base p-3 cursor-pointer hover:bg-default-2 hover:border-design-greenLight'>
                <div className='flex justify-end font-semibold'>
                    <Dropdown menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <span className='text-base font-semibold'>
                                {room.rooms.name}
                            </span>
                            <DownOutlined />
                        </Space>
                        </a>
                    </Dropdown>
                </div>
                <div className='flex justify-end font-semibold'>
                    {room.rooms.kindOfRoom.name}
                </div>
                <div className={`flex items-center pt-10`}>
                    <span
                        className={`px-3 py-1 rounded-full text-white
                            ${room.rooms.statusByDate === 1 ? "bg-design-greenLight" : ""}
                            ${room.rooms.statusByDate === 2 ? "bg-status-2" : ""}
                            ${room.rooms.statusByDate === 3 ? "bg-status-3" : ""}
                        `}
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
                                    <FontAwesomeIcon icon={faBuildingCircleCheck} className="w-[18px] h-[18px]"></FontAwesomeIcon>
                                </span>
                                <span className='ml-3'>
                                    {genDetailInvoice() && genDetailInvoice().hireDate}
                                </span>
                            </div>
                            <div className='flex items-center'>
                                <span className='rounded-full bg-design-charcoalblack h-7 w-7 text-white p-3 flex justify-center items-center'>
                                    <FontAwesomeIcon icon={faPersonWalkingArrowRight} className="w-[18px] h-[18px]"></FontAwesomeIcon>
                                </span>
                                <span className='ml-3'>
                                    {genDetailInvoice() && genDetailInvoice().checkOutDay}
                                </span>
                            </div>
                        </div>
                        <div className='flex items-center mt-3'>
                            <span className='rounded-full bg-design-charcoalblack h-7 w-7 text-white p-3 flex justify-center items-center'>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} className="w-[18px] h-[18px]"></FontAwesomeIcon>
                            </span>
                            <span className='ml-3 text-red-500 font-semibold'>
                                {formatCurrency(genAllMoneyDetail())}
                            </span>
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
                okBtn={checkIn}
            ></MonthlyCalendarRoom>
        </>
    );
}

export default Room;
