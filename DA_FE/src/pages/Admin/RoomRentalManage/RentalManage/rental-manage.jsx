import { DatePicker, Tabs, Button, message, Form } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Personnel from '~/models/Personnel/Personnel';
import Customer from '~/models/Customer/Customer';
import DetailInvoice from '~/models/DetailInvoice/DetailInvoice';
import RoomServices from './TabService/room-services';
import Services from './TabService/services';
import Bill from '~/models/Bill/Bill';
import axios from 'axios';
import CustomerInformation from './TabInformation/customer-information';
import ListRoom from './TabInformation/list-room';
import dayjs  from 'dayjs';
import CheckInInformation from './TabInformation/check-in-information';
import Loading from '~/pages/Loading/loading';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const RentalManage = () => {

    //Data
    const navigate = new useNavigate();
    const key = 'messageApi';
    const [messageApi, contextHolder] = message.useMessage();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { idRoomChoose, type, dateCheckIn, dateCheckOut } = useParams();

    const dateNow = new Date();
    const dateTomorrow = new Date().setDate(dateNow.getDate() + 1);
    const [roomPlan, setRoomPlan] = useState();
    const [rentalTypes, setRentalTypes] = useState();
    const [nationalityList, setNationalityList] = useState();
    const [billActiveList, setBillActiveList] = useState();

    const [personnel, setPersonnel] = useState(new Personnel());
    const [bill, setBill] = useState(new Bill());
    const [customer, setCustomer] = useState(new Customer());
    const [detailInvoices, setDetailInvoices] = useState([]);
    const [serviceDetails, setServiceDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    //End Data

    //Created
    useEffect(() => {
        window.scrollTo(0, 0);
        getRoomPlan();
        getAllRentalType();
        getAllNationality();
        getAllBillActive();
        if (type === 'details') {
            checkData();
        }
    }, []);
    useEffect(() => {
        if(roomPlan && rentalTypes) {
            if(type === "check-in") {
                addRoomDetail();
                setBill({ ...bill, personnel: personnel });
            }
        }
    }, [roomPlan, rentalTypes])
    //End Created

    //Gen Data
    //End Gen Data

    //Function
    const getRoomPlan = async () => {
        await axios.get('http://localhost:8080/api/room-rental-manage/get-room-plan/2022-12-15')
                .then(res => {
                    setRoomPlan(res.data);
                }).catch(err => {});
    }
    const getAllRentalType = async () => {
        await axios.get('http://localhost:8080/api/rental-type')
                .then(res => {
                    setRentalTypes(res.data);
                }).catch(err => {});
    }
    const getAllNationality = async () => {
        await axios.get('http://localhost:8080/api/nationality')
                .then(res => {
                    setNationalityList(res.data);
                }).catch(err => {});
    }
    const getAllBillActive = async () => {
        await axios.get('http://localhost:8080/api/room-rental-manage/all-bill-active')
                .then(res => {
                    setBillActiveList(res.data);
                }).catch(err => {});
    }
    //End Function

    //Util
    //End Util
    
    const addRoomDetail = () => {
        //Add room
        if (detailInvoices.length === 0) {
            const newDetailInvoice = new DetailInvoice();
            newDetailInvoice.rooms = getRoomChoose().rooms;
            newDetailInvoice.facilitiesDetailsList = getRoomChoose().facilitiesDetailsList;
            newDetailInvoice.serviceAvailableList = getRoomChoose().serviceAvailableList;
            newDetailInvoice.key = getRoomChoose().rooms.id;
            newDetailInvoice.hireDate = dayjs(dateCheckIn).format('YYYY-MM-DD') + " " + window.localStorage.getItem("time-in");
            newDetailInvoice.checkOutDay = dayjs(dateCheckOut).format('YYYY-MM-DD') + " " + window.localStorage.getItem("time-out");
            newDetailInvoice.rentalTypes = rentalTypes[0];
            setDetailInvoices([...detailInvoices, newDetailInvoice]);
        }
    };

    console.log(bill);

    const checkData = async () => {
        const response = await axios.get('http://localhost:8080/api/room-rental-manage/details/' + idRoomChoose);
        setDetailInvoices(
            response.data.detailsInvoiceList
        );
        // //Set Detail Invoice
        // const detailInvoicesResponse = response.data.detailsInvoiceList;
        // detailInvoicesResponse.facilitiesDetailsList = getRoomChoose().facilitiesDetailsList;
        // detailInvoicesResponse.serviceAvailableList = getRoomChoose().serviceAvailableList;
        // detailInvoicesResponse.key = getRoomChoose().rooms.id;
        // detailInvoicesResponse.hireDate =
        //     detailInvoicesResponse.hireDate.split('T')[0] + ' ' + detailInvoicesResponse.hireDate.split('T')[1];
        // detailInvoicesResponse.checkOutDay =
        //     detailInvoicesResponse.checkOutDay.split('T')[0] + ' ' + detailInvoicesResponse.checkOutDay.split('T')[1];
        // setDetailInvoices([...detailInvoices, detailInvoicesResponse]);
        //Set Service Detail
        setServiceDetails(response.data.serviceDetailsList);
        // //Set Customer
        setCustomer(response.data.bills.customer);
        const billData = response.data.bills;
        billData.customerPay = 0;
        billData.customerReturnMoney = 0;
        setBill(billData);
    };

    const getRoomByRoomPlan = (idRoom) => {
        let room = null;
        if(roomPlan) {
            roomPlan.forEach((element) => {
                element.listRoom.forEach((element) => {
                    if (element.rooms.id === Number(idRoom)) {
                        room = element;
                    }
                });
            });
        }
        return room;
    };

    const getRoomChoose = () => {
        let roomChoose = null;
        if(roomPlan) {
            roomPlan.forEach((element) => {
                element.listRoom.forEach((element) => {
                    if (element.rooms.id === Number(idRoomChoose)) {
                        roomChoose = element;
                    }
                });
            });
        }
        return roomChoose;
    };

    const triggerAction = async () => {
        setIsLoading(true);
        // setConfirmLoading(true);
        // messageApi.open({
        //     key,
        //     type: 'loading',
        //     content: 'Vui lòng chờ...',
        // });
        if (type === 'check-in') {
            await axios.post('http://localhost:8080/api/room-rental-manage/check-in', {
                customer: customer,
                bill: bill,
                detailInvoices: detailInvoices,
                serviceDetails: serviceDetails,
            }).then(res => {
                if(res) {
                    setTimeout(() => {
                        // setConfirmLoading(false);
                        // messageApi.open({
                        //     key,
                        //     type: 'success',
                        //     content: 'Check in thành công!',
                        //     duration: 2,
                        // });
                        setIsLoading(false);
                        navigate('/admin/room-plan');
                        toast.success('Check in thành công!', { autoClose: 2000 });
                    }, 1000);
                }
            }).catch(err => {
                setTimeout(() => {
                    // setConfirmLoading(false);
                    messageApi.open({
                        key,
                        type: 'error',
                        content: 'Lỗi, vui lòng kiểm tra lại!',
                        duration: 2,
                    });
                }, 1000);
            }).finally(() => {
                
            });
        }
        if (type === 'details') {
            const response = await axios.post('http://localhost:8080/api/room-rental-manage/update-detail', {
                detailInvoices: detailInvoices,
                serviceDetails: serviceDetails,
                bill: bill,
                customer: customer,
            }).then((res) => {
                if(res) {
                    setTimeout(() => {
                        // setConfirmLoading(false);
                        checkData();
                        // messageApi.open({
                        //     key,
                        //     type: 'success',
                        //     content: 'Cập nhật thành công!',
                        //     duration: 2,
                        // });
                        setIsLoading(false);
                        toast.success('Cập nhật thành công!', { autoClose: 2000 });
                    }, 1000);
                }
            })
            .catch((err) => {
                setTimeout(() => {
                    // setConfirmLoading(false);
                    messageApi.open({
                        key,
                        type: 'error',
                        content: 'Lỗi, vui lòng kiểm tra lại!',
                        duration: 2,
                    });
                }, 1000);
            })
            .finally(() => {});
        }
    };


    return (
        <>
            { contextHolder }
            {isLoading && (<Loading></Loading>)}
            <div>
                <div className="text-lg font-semibold mb-3">
                    { type === "check-in" && <span>Check in - { getRoomChoose() && getRoomChoose().rooms.name }</span> }
                    { type === "details" && <span>Chi tiết thuê phòng - Khách hàng: { bill.customer ? bill.customer.fullname : "" }</span> }
                </div>
                <Tabs defaultActiveKey="1" size="large">
                    <TabPane tab="Thông tin" key="1" className="grid grid-cols-12 gap-12 text-base">
                        <div className='col-span-5'>
                            <CustomerInformation
                                customer={customer}
                                setCustomer={setCustomer}
                                type={type}
                                bill={bill}
                                setBill={setBill}
                                nationalityList={nationalityList}
                                billActiveList={billActiveList}
                                form={form}
                                onFinish={triggerAction}
                            ></CustomerInformation>
                        </div>
                        <div className='col-span-7'>
                            <CheckInInformation
                                bill={bill}
                                setBill={setBill}
                                detailInvoices={detailInvoices}
                                serviceDetails={serviceDetails}
                                type={type}
                                open={open}
                                setOpen={setOpen}
                                dateNow={dateNow}
                                rentalTypeList={rentalTypes}
                                checkData={checkData}
                            ></CheckInInformation>
                        </div>
                    </TabPane>
                    <TabPane tab="Phòng" key="3" className="grid grid-cols-2 gap-12 text-base">
                        <ListRoom
                            detailInvoices={detailInvoices}
                            setDetailInvoices={setDetailInvoices}
                            serviceDetails={serviceDetails}
                            setServiceDetails={setServiceDetails}
                            bill={bill}
                            rentalTypeList={rentalTypes}
                            dateNow={dateNow}
                            dateTomorrow={dateTomorrow}
                        ></ListRoom>
                    </TabPane>
                    <TabPane tab="Dịch vụ" key="2" className="grid grid-cols-2 gap-12 text-base">
                        <RoomServices
                            detailInvoices={detailInvoices}
                            setDetailInvoices={setDetailInvoices}
                            serviceDetails={serviceDetails}
                            setServiceDetails={setServiceDetails}
                        ></RoomServices>
                        <Services
                            detailInvoices={detailInvoices}
                            serviceDetails={serviceDetails}
                            setServiceDetails={setServiceDetails}
                        ></Services>
                    </TabPane>
                </Tabs>
                <div className="mt-6 flex justify-end">
                    {type === "details" && (
                        <Button
                            onClick={() => setOpen(true)}
                            className="mr-3"
                        >
                            Thanh toán
                        </Button>
                    )}
                    <Button
                        onClick={() => form.submit()}
                        loading={confirmLoading}
                        htmlType="submit"
                    >
                        {type === "check-in" && <span>Check in</span>}
                        {type === "details" && <span>Lưu</span>}
                    </Button>
                </div>
            </div>
        </>
    );
}

export default RentalManage;
