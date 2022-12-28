import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Form, InputNumber, Modal, Radio, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import validateMessages from "~/config/rules";
import Loading from "~/pages/Loading/loading";

const UnPaid = ({listBookingUnPaid, setListBookingUnPaid, getListBookingPaid, getListBookingUnPaid, getListBookingCancel}) => {

    const [isLoading, setIsLoading] = useState(false);
    // const [listBookingUnPaid, setListBookingUnPaid] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataBooking, setDataBooking] = useState();
    const [chooseOption, setChooseOption] = useState("PAYMENT");
    const columns = [
        { title: 'Tên khách hàng', dataIndex: 'customerName', key: '1'},
        { title: 'Số điện thoại', dataIndex: 'customerPhoneNumber', key: '2'},
        { title: 'Email', dataIndex: 'customerEmail', key: '3'},
        { title: 'Loại phòng', dataIndex: 'kindOfRoom', key: '4',
            render: (kindOfRoom) => (
                <span>
                    {kindOfRoom.name}
                </span>
            )
        },
        { title: 'Số lượng phòng', dataIndex: 'quantityRoom', key: '12',},
        { title: 'Ngày đến', dataIndex: 'hireDate', key: '5'},
        { title: 'Ngày trả phòng', dataIndex: 'checkOutDay', key: '6'},
        { title: 'Số người lớn', dataIndex: 'numberOfAdults', key: '8'},
        { title: 'Số trẻ em', dataIndex: 'numberOfKids', key: '9'},
        { title: '', dataIndex: '', key: '11',
            render: (element) => (
                <span onClick={() => showModal(element)}>
                    <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="hover:text-design-greenLight cursor-pointer"
                    ></FontAwesomeIcon>
                </span>
            ),
        },
    ];
    const [moneyPayment, setMoneyPayment] = useState();
    const [note, setNote] = useState();

    useEffect(() => {
        getListBookingUnPaid();
    }, [])

    const showModal = (value) => {
        setDataBooking(value);
        setIsModalOpen(true);
    };
    
    const handleOk = () => {
        setIsModalOpen(false);
        setDataBooking();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDataBooking();
    };

    // const getListBookingUnPaid = async () => {
    //     await axios
    //         .get('http://localhost:8080/api/booking/get-list-booking-unpaid')
    //         .then(res => {
    //             setListBookingUnPaid(res.data);
    //         })
    //         .catch(err => {});
    // }

    const formatCurrency = (value) => {
        return value.toLocaleString(
            'it-IT',
            {
                style : 'currency',
                currency : 'VND'
            }
        );
    };

    const customerPayment = async () => {
        setIsLoading(true);
        const params = {
            ...dataBooking,
            deposits: moneyPayment,
            paymentStatus: 2,
        }
        await axios
            .post('http://localhost:8080/api/booking', params)
            .then(
                (res) => {
                    if(res) {
                        setTimeout(() => {
                            setIsModalOpen(false);
                            setIsLoading(false);
                        }, 500);
                        getListBookingUnPaid();
                        toast.success('Thanh toán thành công', { autoClose: 2000 });
                    }
                }
            )
            .catch((err) => {});
    }

    const cancelBooking = async () => {
        setIsLoading(true);
        const params = {
            ...dataBooking,
            note: note,
            status: 3,
        }
        await axios
            .post('http://localhost:8080/api/booking', params)
            .then(
                (res) => {
                    if(res) {
                        setTimeout(() => {
                            setIsModalOpen(false);
                            setIsLoading(false);
                        }, 500);
                        getListBookingUnPaid();
                        toast.success('Hủy đặt thành công', { autoClose: 2000 });
                    }
                }
            )
            .catch((err) => {});
    }

    return (
        <>
            {isLoading && (<Loading></Loading>)}
            <Modal
                title={"Chi tiết booking"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                style={{ top: 20 }}
            >
                
                <div className="text-base">
                    <div className="my-2">
                        Tên khách hàng: {dataBooking && dataBooking.customerName}
                    </div>
                    <div className="my-2">
                        Số điện thoại: {dataBooking && dataBooking.customerPhoneNumber}
                    </div>
                    <div className="my-2">
                        Email: {dataBooking && dataBooking.customerEmail}
                    </div>
                    <div className="my-2">
                        Loại phòng book: {dataBooking && dataBooking.kindOfRoom.name}
                    </div>
                    <div className="my-2">
                        Ngày đến: {dataBooking && dataBooking.hireDate}
                    </div>
                    <div className="my-2">
                        Ngày đi: {dataBooking && dataBooking.checkOutDay}
                    </div>
                    <div className="my-2">
                        Số người lớn: {dataBooking && dataBooking.numberOfAdults}
                    </div>
                    <div className="my-2">
                        Số trẻ em: {dataBooking && dataBooking.numberOfKids}
                    </div>
                    <div className="my-2">
                        Tiền cần thanh toán: {dataBooking && formatCurrency(dataBooking.moneyToPay ? dataBooking.moneyToPay : 0)}
                    </div>

                    <Radio.Group onChange={(e) => setChooseOption(e.target.value)} value={chooseOption}>
                        <Radio value={"PAYMENT"} className="text-base">Thanh toán</Radio>
                        <Radio value={"CANCEL"} className="text-base">Khách hủy đặt phòng</Radio>
                    </Radio.Group>

                    {chooseOption === "PAYMENT" && (
                        <Form
                            name="payment"
                            onFinish={customerPayment}
                            validateMessages={validateMessages}
                            className="mt-3"
                        >
                            <div className="text-base">
                                <div className="mb-1">
                                    Tiền khách thanh toán: 
                                </div>
                                <Form.Item
                                    name="Tiền khách thanh toán"
                                    rules={[
                                        {   
                                            required: true,

                                        },
                                    ]}
                                    hasFeedback 
                                    value={moneyPayment}
                                >
                                    <InputNumber
                                        size="large"
                                        className="w-full"
                                        placeholder="Nhập tiền khách thanh toán..."
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        addonAfter={"VND"}
                                        onChange={
                                            (e) => setMoneyPayment(e)
                                        }
                                    />
                                </Form.Item>
                                <Button htmlType="submit" size="large" className="w-full text-base mt-3" type="primary">
                                    Khách thanh toán
                                </Button>
                            </div>
                        </Form>
                    )}

                    {chooseOption === "CANCEL" && (
                        <Form
                            name="cancel"
                            onFinish={cancelBooking}
                            validateMessages={validateMessages}
                            className="mt-3"
                        >
                            <div className="text-base">
                                <div className="mb-1">
                                    Ghi chú hủy phòng: 
                                </div>
                                <Form.Item
                                    name="Ghi chú hủy phòng"
                                    rules={[
                                        {   
                                            required: true,
                                        },
                                    ]}
                                    hasFeedback 
                                    value={note}
                                >
                                    <TextArea
                                        size="large"
                                        showCount
                                        maxLength={500}
                                        style={{ height: 120, resize: 'none' }}
                                        className="w-full"
                                        placeholder="Ghi chú hủy đặt phòng..."
                                        value={note}
                                        onChange={
                                            (e) => setNote(e.target.value)
                                        }
                                    />
                                </Form.Item>
                                <Button htmlType="submit" size="large" className="w-full text-base mt-3" type="primary">
                                    Khách hủy đặt phòng
                                </Button>
                            </div>
                        </Form>
                    )}
                </div>
            </Modal>

            <Table
                size="middle"
                locale={{emptyText: "Chưa có đơn book nào!"}}
                bordered
                pagination={true}
                columns={columns}
                dataSource={listBookingUnPaid}
            />
        </>
    )
}

export default UnPaid;