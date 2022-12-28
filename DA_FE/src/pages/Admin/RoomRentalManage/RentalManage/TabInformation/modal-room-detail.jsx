import { Button, Card, InputNumber, message, Modal } from "antd";
import { useState } from 'react';
import ServiceDetail from "~/models/ServiceDetail/ServiceDetail";

function ModalRoomDetail({ detailModalDetailInvoice, detailInvoices, serviceDetails, setServiceDetails }) {

    //Data
    const [messageApi, contextHolder] = message.useMessage();
    const key = "messageApi";
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [chooseService, setChooseService] = useState();
    const [amountUsed, setAmountUsed] = useState(1);
    //End Data

    //Created
    //End Created

    //Gen Data
    //End Gen Data

    //Function
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpenModal(false);
            setConfirmLoading(false);
            if(serviceDetails) {
                if(serviceDetails.find(element => element.servicess.id === chooseService.id && element.detailsInvoice.rooms.id === detailModalDetailInvoice.rooms.id)) {
                    setServiceDetails(
                        serviceDetails.map(element => {
                            if(element.servicess.id === chooseService.id && element.detailsInvoice.rooms.id === detailModalDetailInvoice.rooms.id) {
                                return {...element, quantity: element.quantity + amountUsed}
                            } else {
                                return element;
                            }
                        })
                    );
                } else {
                    const newServiceDetail = new ServiceDetail();
                    newServiceDetail.servicess = chooseService;
                    newServiceDetail.detailsInvoice = detailModalDetailInvoice;
                    newServiceDetail.quantity = amountUsed;
                    setServiceDetails([...serviceDetails, newServiceDetail]);
                }
            }
            setChooseService();
            setAmountUsed(1);
        }, 1000);
        setTimeout(() => {
            messageApi.open({
                key,
                type: 'success',
                content: 'Thêm thành công!',
                duration: 2,
            });
        }, 1000);
    }
    const handleCancel = () => {
        setOpenModal(false);
        setChooseService();
        setAmountUsed(1);
    }
    const openModalConfirm = (value, quantity) => {
        setOpenModal(true);
        setChooseService({...value, quantity: quantity});
    }
    const changeAmountUsed = (value) => {
        if(value <= 0 || value === "") {
            setAmountUsed(1);
        } else if(value > chooseService.quantity) {
            setAmountUsed(chooseService.quantity);
        } else {
            setAmountUsed(value);
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
            <Modal
                width={400}
                title="Sử dụng Mini bar"
                open={openModal}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Thêm"
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <span className="font-semibold mt-3">{chooseService && chooseService.name}</span>
                <div className="mt-3">
                    Đơn giá: 
                    <span className="ml-3 font-semibold">{chooseService && formatCurrency(chooseService.prices)}</span>
                </div>
                <div className="mt-3">
                    Số lượng có trong phòng: 
                    <span className="ml-3 font-semibold">{chooseService && chooseService.quantity}</span>
                </div>
                <div className="mt-3 flex items-center">
                    Nhập số lượng dùng:
                    <InputNumber
                        className="ml-3 w-16"
                        onChange={(e) => changeAmountUsed(e)}
                        value={amountUsed}
                    ></InputNumber>
                    <Button className="ml-3" onClick={() => {setAmountUsed(chooseService.quantity)}}>Max</Button>
                </div>
                <div className="mt-3">
                    Tổng tiền: 
                    <span className="ml-3 font-semibold">{chooseService && formatCurrency(chooseService.prices * amountUsed)}</span>
                </div>
            </Modal>
            <div>
                <div className="mt-3">
                    Loại phòng:
                    <span className="font-semibold ml-3">{ detailModalDetailInvoice.rooms.kindOfRoom.name }</span>
                </div>
                <div className="mt-3">
                    Giá theo giờ:
                    <span className="font-semibold ml-3">{ formatCurrency(detailModalDetailInvoice.rooms.kindOfRoom.hourlyPrice) }</span>
                </div>
                <div className="mt-3">
                    Giá theo ngày:
                    <span className="font-semibold ml-3">{ formatCurrency(detailModalDetailInvoice.rooms.kindOfRoom.priceByDay) }</span>
                </div>
                <div>
                    <Card title="Mini bar" className="text-base mt-3" bodyStyle={{padding: 12}} headStyle={{paddingLeft: 12, paddingRight: 12}}>
                        <div className="grid grid-cols-3 gap-3">
                            {detailModalDetailInvoice.serviceAvailableList && detailModalDetailInvoice.serviceAvailableList.map((element, index) => {
                                return (
                                    <div
                                        key={index}
                                        onClick={() => openModalConfirm(element.servicess, element.quantity)}
                                        className='border border-1 rounded-lg px-3 py-1 hover:border-design-greenLight cursor-pointer select-none'
                                    >
                                        {element.servicess.name} (Sl: {element.quantity})
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
                <div>
                    <Card title="Trang thiết bị" className="text-base mt-3" bodyStyle={{padding: 12}} headStyle={{paddingLeft: 12, paddingRight: 12}}>
                        <div className="grid grid-cols-3 gap-3">
                            {detailModalDetailInvoice.facilitiesDetailsList && detailModalDetailInvoice.facilitiesDetailsList.map((element, index) => {
                                return (
                                    <div key={index} className='border border-1 rounded-lg px-3 py-1 hover:border-design-greenLight cursor-pointer select-none'>
                                        {element.facilities.name}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </>  
    );
}

export default ModalRoomDetail;