import { PlusOutlined } from '@ant-design/icons';
import { Divider, Modal, message } from 'antd';
import { useState, useEffect } from 'react';
import RoomDetail from './room-detail';
import DetailInvoice from '~/models/DetailInvoice/DetailInvoice';
import dayjs from 'dayjs';
import axios from 'axios';
import ModalDetailInvoice from './modal-detail-invoice';
import ModalRoomDetail from './modal-room-detail';
import ListRoomModal from "../../ListRoom/listRoom";
import { date } from 'yup';

function ListRoom({ detailInvoices, setDetailInvoices, serviceDetails, setServiceDetails, bill, rentalTypeList, dateNow, dateTomorrow }) {

    //Data
    const [messageApi, contextHolder] = message.useMessage();
    const key = "messageApi";
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [openModalRoom, setOpenModalRoom] = useState(false);
    const [openModalDetailInvoice, setOpenModalDetailInvoice] = useState(false);
    const [openModalRoomDetail, setOpenModalRoomDetail] = useState(false);
    const [openModalListRoom, setOpenModalListRoom] = useState(false);


    const [roomChoose, setRoomChoose] = useState([]);
    const [roomPlanDefault, setRoomPlanDefault] = useState();
    // const rentalTypes = useSelector((state) => state.rentalType.rentalTypes);
    const [detailModalDetailInvoice, setDetailModalDetailInvoice] = useState();
    //End Data

    //Created
    useEffect(() => {
        getRoomPlan();
    }, [])
    //End Created

    //Gen Data
    const genDetail = (room) => {
        let floor = roomPlanDefault.find((element) => element.numberOfFloors === room.numberOfFloors.numberOfFloors);
        let detailedRoom = floor.listRoom.find((element) => element.rooms.id === room.id);
        return detailedRoom;
    };
    //End Gen Data

    //Function
    const getRoomPlan = async () => {
        await axios.get('http://localhost:8080/api/room-rental-manage/get-room-plan/2022-12-15')
                .then(res => {
                    setRoomPlanDefault(res.data);
                }).catch(err => {});
    }

    const extraRoom = (data) => {
        const newDetailInvoice = new DetailInvoice();
        newDetailInvoice.rooms = data.room;
        newDetailInvoice.bills = bill;
        newDetailInvoice.facilitiesDetailsList = genDetail(data.room).facilitiesDetailsList;
        newDetailInvoice.serviceAvailableList = genDetail(data.room).serviceAvailableList;
        newDetailInvoice.rentalTypes = rentalTypeList[0];
        newDetailInvoice.hireDate = dayjs(data.hireDate).format('YYYY-MM-DD') + " " + window.localStorage.getItem("time-in");
        newDetailInvoice.checkOutDay = dayjs(data.checkOutDay).format('YYYY-MM-DD') + " " + window.localStorage.getItem("time-out");
        setDetailInvoices([
            ...detailInvoices,
            newDetailInvoice,
        ])
    }

    // const addRoom = () => {
    //     const array = [];
    //     roomChoose.forEach((element) => {
    //         console.log(bill);
    //         const newDetailInvoice = new DetailInvoice();
    //         newDetailInvoice.rooms = element;
    //         newDetailInvoice.bills = bill;
    //         newDetailInvoice.facilitiesDetailsList = genDetail(element).facilitiesDetailsList;
    //         newDetailInvoice.serviceAvailableList = genDetail(element).serviceAvailableList;
    //         newDetailInvoice.rentalTypes = rentalTypeList[0];
    //         newDetailInvoice.hireDate = dayjs(dateNow).format('YYYY-MM-DD') + " 12:00";
    //         newDetailInvoice.checkOutDay = dayjs(dateTomorrow).format('YYYY-MM-DD') + " 12:00";
    //         newDetailInvoice.key = element.id;
    //         array.push(newDetailInvoice);
    //     });
    //     detailInvoices.map((element) => {
    //         array.push(element);
    //     });
    //     setDetailInvoices(array);
    //     setRoomChoose([]);
    //     setOpenModalRoom(false);
    // };

    const showModalDetailInvoice = () => {
        setOpenModalDetailInvoice(true);
    };

    const changeDetailInvoice = () => {
        setConfirmLoading(true);
        if(detailModalDetailInvoice) {
            setTimeout(() => {
                setOpenModalDetailInvoice(false);
                setConfirmLoading(false);
                setDetailInvoices(
                    detailInvoices.map(element => {
                        if(element.rooms.id === detailModalDetailInvoice.rooms.id) {
                            return detailModalDetailInvoice;
                        } else {
                            return element;
                        }
                    })
                );
            }, 1000);
            setTimeout(() => {
                messageApi.open({
                    key,
                    type: 'success',
                    content: 'Cập nhật thành công!',
                    duration: 2,
                });
            }, 1000);
        } else {
            setTimeout(() => {
                setConfirmLoading(false);
            }, 1000);
            setTimeout(() => {
                messageApi.open({
                    key,
                    type: 'error',
                    content: 'Lỗi, vui lòng kiểm tra lại!',
                    duration: 2,
                });
            }, 1000);
        }
    };
    const cancelModalDetailInvoice = () => {
        setDetailModalDetailInvoice();
        setOpenModalDetailInvoice(false);
    };
    const showModalRoomDetail = () => {
        setOpenModalRoomDetail(true);
    };
    const cancelModalRoomDetail = () => {
        setOpenModalRoomDetail(false);
    };
    //End Function

    //Util
    //End Util

    return (
        <div className="col-span-2">

            { contextHolder }

            <Divider orientation="left">
                <div className="text-base font-semibold flex items-center">
                    Phòng
                    <div
                        onClick={() => setOpenModalListRoom(true)}
                        className="h-full cursor-pointer rounded-lg p-1.5 w-8 ml-2 bg-design-greenLight text-white flex justify-center items-center"
                    >
                        <PlusOutlined />
                    </div>
                    <Modal 
                        width={1800}
                        title={"Sơ đồ phòng"}
                        open={openModalListRoom}
                        onCancel={() => setOpenModalListRoom(false)}
                        okButtonProps={{ style: { display: 'none' } }}
                        cancelButtonProps={{ style: { display: 'none' } }}
                        style={{ top: 20 }}
                    >
                        <ListRoomModal
                            optionType={"CHECK-IN/EXTRA-ROOM"}
                            openModalListRoom={openModalListRoom}
                            setOpenModalListRoom={setOpenModalListRoom}
                            // hireDate={dataBooking && dataBooking.hireDate}
                            // kindOfRoomBooking={dataBooking && dataBooking.kindOfRoom.id}
                            // dataBooking={dataBooking}
                            // setDataBooking={setDataBooking}
                            // dataBill={dataBill}
                            // setDataBill={setDataBill}
                            // roomBookingList={roomBookingList}
                            // setRoomBookingList={setRoomBookingList}
                            extraRoom={extraRoom}
                            listRoomChoose={detailInvoices}
                        ></ListRoomModal>
                    </Modal>
                </div>
            </Divider>

            <Modal
                title={detailModalDetailInvoice ? detailModalDetailInvoice.rooms.name : ""}
                open={openModalDetailInvoice}
                onOk={changeDetailInvoice}
                confirmLoading={confirmLoading}
                onCancel={cancelModalDetailInvoice}
                okText="Lưu"
                cancelText="Hủy"
            >
                <ModalDetailInvoice
                    detailModalDetailInvoice={detailModalDetailInvoice}
                    setDetailModalDetailInvoice={setDetailModalDetailInvoice}
                    setDetailInvoices={setDetailInvoices}
                    rentalTypeList={rentalTypeList}
                ></ModalDetailInvoice>
            </Modal>

            <Modal
                title={ detailModalDetailInvoice ? detailModalDetailInvoice.rooms.name : "" }
                open={ openModalRoomDetail }
                cancelButtonProps={{ style: { display: 'none' } }}
                confirmLoading={confirmLoading}
                onOk={cancelModalRoomDetail}
                onCancel={cancelModalRoomDetail}
                okText="Xong"
            >
                <ModalRoomDetail
                    detailModalDetailInvoice={detailModalDetailInvoice}
                    detailInvoices={detailInvoices}
                    serviceDetails={serviceDetails}
                    setServiceDetails={setServiceDetails}
                ></ModalRoomDetail>
            </Modal>

            <div className="grid grid-cols-3 gap-12">
                {detailInvoices.map((element, index) => {
                    if(element.status !== 4) {
                        return (
                            <RoomDetail
                                key={index}
                                detailInvoice={element}
                                detailInvoiceList={detailInvoices}
                                setDetailInvoices={setDetailInvoices}
                                showModalDetailInvoice={showModalDetailInvoice}
                                setDetailModalDetailInvoice={setDetailModalDetailInvoice}
                                showModalRoomDetail={showModalRoomDetail}
                                rentalTypeList={rentalTypeList}
                                dateNow={dateNow}
                            ></RoomDetail>
                        );
                    }
                })}
            </div>

        </div>
    );
}

export default ListRoom;
