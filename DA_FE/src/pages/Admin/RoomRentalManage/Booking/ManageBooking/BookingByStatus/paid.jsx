import { Button, Checkbox, DatePicker, Divider, Form, Input, InputNumber, Modal, Radio, Select, Switch, Table } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingCircleCheck, faCircleExclamation, faCircleXmark, faPersonWalkingArrowRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import axios from "axios";
import ListRoom from "../../../ListRoom/listRoom";
import { UserOutlined, SearchOutlined, CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Loading from "~/pages/Loading/loading";
import { toast } from 'react-toastify';
import validateMessages from "~/config/rules";
import TextArea from "antd/es/input/TextArea";
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

function Paid({listBookingPaid, setListBookingPaid, getListBookingPaid, getListBookingUnPaid, getListBookingCancel}) {

    //Data
    // const [listBookingPaid, setListBookingPaid] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openModalListRoom, setOpenModalListRoom] = useState(false);
    const [openModalCheckIn, setOpenModalCheckIn] = useState(false);
    const [dataBooking, setDataBooking] = useState();
    const [dataBill, setDataBill] = useState();
    const [roomBookingList, setRoomBookingList] = useState();
    const [queryCustomerName, setQueryCustomerName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chooseOption, setChooseOption] = useState("CHECK_IN");
    const [note, setNote] = useState();
    const [initialValues, setInitialValues] = useState();
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue(initialValues)
    }, [form, initialValues])
    const genders = [
        { value: 'Nam', label: 'Nam' },
        { value: 'Nữ', label: 'Nữ' },
    ];
    const [nationalityList, setNationalityList] = useState();
    const columns = [
        { title: 'Tên khách hàng', dataIndex: 'customerName', key: '1',
            render: (customerName, element) => (
                <div className="font-semibold">
                    {customerName}
                    {element.bookingStatus === 1 && (
                        <span className="text-white font-semibold rounded-lg bg-status-2 px-2 py-1 ml-3">
                            {element.bookingStatus === 1 && "Mới"}
                        </span>
                    )}
                    {/* {element.bookingStatus === 2 && (
                        <span className="text-white font-bold rounded-lg bg-status-1 px-2 py-1 ml-3">
                            {element.bookingStatus === 2 && (<CheckOutlined />)}
                        </span>
                    )} */}
                </div>
            )
        },
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
        // { title: 'Trạng thái', dataIndex: 'bookingStatus', key: '13',
        //     render: (bookingStatus) => (
        //         <div className="w-full">
        //             <span className={`rounded-full w-full px-3 py-1 text-white ${bookingStatus === 1 ? 'bg-status-2' : 'bg-status-4'}`}>
        //                 {bookingStatus === 1 ? "Mới" : "Đã xếp phòng"}
        //             </span>
        //         </div>
        //     )
        // },
        // { title: 'Số người lớn', dataIndex: 'numberOfAdults', key: '8'},
        // { title: 'Số trẻ em', dataIndex: 'numberOfKids', key: '9'},
        // { title: 'Tiền thanh toán', dataIndex: 'deposits', key: '10',
        //     render: (deposits) => (
        //         <span>
        //             {formatCurrency(deposits)}
        //         </span>
        //     )
        // },
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
    const columnsRoomBookingList = [
        { title: 'Phòng', dataIndex: 'customerName', key: '1',
            render: (_, x) => (
                <span>
                    {x.rooms.name}
                </span>
            )
        },
        { title: 'Loại phòng', dataIndex: 'customerName', key: '4',
            render: (_, x) => (
                <span>
                    {x.rooms.kindOfRoom.name}
                </span>
            )
        },
        { title: 'Nhận phòng', dataIndex: 'hireDate', key: '2' },
        { title: 'Trả phòng', dataIndex: 'checkOutDay', key: '3' },
        { title: '', dataIndex: '', key: '4',
            render: (x) => (
                <span
                    className="flex justify-center items-center hover:text-status-2 cursor-pointer"
                    onClick={() => deleteBookingRoom(x.id)}
                >
                    <FontAwesomeIcon className="w-5 h-5" icon={faCircleXmark}></FontAwesomeIcon>
                </span>
            )
        },
    ];
    const [chooseDateNow, setChooseDateNow] = useState(true);
    const [chooseNew, setChooseNew] = useState(false);
    const [chooseDone, setChooseDone] = useState(false);
    //End Data

    //Created
    useEffect(() => {
        getListBookingPaid();
        getAllNationality();
    }, [])
    useEffect(() => {
        if(dataBooking) {
            getBillByBooking(dataBooking.id)
            getRoomBookingList(dataBooking.id);
        }
    }, [dataBooking])
    //End Created

    //Gen Data
    const genNationality = () => {
        const array = [];
        if(nationalityList) {
            nationalityList.forEach((element) => {
                array.push({ value: element.id, label: element.name });
            });
        }
        return array;
    };

    const genListBookingPaidFilter = () => {
        let data = "";
        if(listBookingPaid) {
            data = listBookingPaid;
            data = data.filter(
                (x) => x
                    .customerName
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(queryCustomerName.toLowerCase().replace(/\s+/g, ''))
            )
        }
        return data;
    }

    const genBookingPaidListFilter = () => {
        let data = "";
        if(listBookingPaid) {
            data = listBookingPaid;
            data = data.filter(
                (x) => x
                    .customerName
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(queryCustomerName.toLowerCase().replace(/\s+/g, ''))
            )
            if(chooseDateNow) {
                data = data.filter(
                    (x) => x.hireDate === dayjs(new Date()).format("YYYY-MM-DD")
                )
            }
            if(chooseDone) {
                data = data.filter(
                    (x) => x.bookingStatus === 2
                )
            }
            if(chooseNew) {
                data = data.filter(
                    (x) => x.bookingStatus === 1
                )
            }
        }
        return data;
    }
    //End Gen Data

    //Function
    // const getListBookingPaid = async () => {
    //     await axios
    //         .get('http://localhost:8080/api/booking/get-list-booking-paid')
    //         .then(res => {
    //             setListBookingPaid(res.data);
    //         })
    //         .catch(err => {});
    // }

    const getBillByBooking = async (idBooking) => {
        await axios
            .get('http://localhost:8080/api/booking/get-bill-by-booking/' + idBooking)
            .then(res => {
                setDataBill(res.data);
            })
            .catch(err => {});
    }

    const getRoomBookingList = async (idBooking) => {
        await axios
            .get('http://localhost:8080/api/booking/get-room-booking-list/' + idBooking)
            .then(res => {
                setRoomBookingList(res.data);
            })
            .catch(err => {});
    }

    const getAllNationality = async () => {
        await axios
            .get('http://localhost:8080/api/nationality')
            .then(res => {
                setNationalityList(res.data);
            }).catch(err => {});
    }

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

    const showModalListRoom = () => {
        setOpenModalListRoom(true);
    };

    const handleOkListRoom = () => {
        setOpenModalListRoom(false);
    };

    const handleCancelListRoom = () => {
        setOpenModalListRoom(false);
    };

    const checkInBooking = async () => {
        setIsLoading(true);
        const params = {
            dataBill: {
                ...dataBill,
                booking: {
                    ...dataBill.booking,
                    status: 2,
                },
                status : 1,
            },
            roomBookingList: roomBookingList.map(
                (x) => ({
                    ...x,
                    status: 1,
                })
            ),
        }

        await axios
            .post('http://localhost:8080/api/booking/check-in-booking', params)
            .then((res) => {
                if(res) {
                    getListBookingUnPaid();
                    getListBookingCancel();
                    getListBookingPaid();
                    setTimeout(() => {
                        setIsLoading(false);
                        toast.success('Khách nhận phòng thành công', { autoClose: 2000 });
                        setIsLoading(false)
                        setOpenModalCheckIn(false);
                        setIsModalOpen(false);
                    }, 500);
                }
            })
            .catch((err) => {});
    }

    const deleteBookingRoom = async (idDetailInvoice) => {
        setIsLoading(true);
        await axios
            .get('http://localhost:8080/api/booking/delete-booking-room/' + idDetailInvoice)
            .then((res) => {
                if(res.data === "SUCCESS") {
                    setRoomBookingList(
                        roomBookingList.filter(
                            (x) => x.id !== idDetailInvoice
                        )
                    )
                    setTimeout(() => {
                        setIsLoading(false);
                        toast.success('Xóa phòng đặt thành công', { autoClose: 2000 });
                    }, 500);
                }
            })
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
                        getListBookingUnPaid();
                        getListBookingCancel();
                        getListBookingPaid();
                        setTimeout(() => {
                            setIsModalOpen(false);
                            setIsLoading(false);
                        }, 500);
                        toast.success('Hủy đặt phòng thành công', { autoClose: 2000 });
                    }
                }
            )
            .catch((err) => {});
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

    console.log(initialValues);

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
                        Loại phòng: {dataBooking && dataBooking.kindOfRoom.name}
                    </div>
                    <div className="my-2">
                        Số lượng phòng: {dataBooking && dataBooking.quantityRoom}
                    </div>
                    <div className="my-2">
                        Ngày nhận phòng: {dataBooking && dataBooking.hireDate}
                    </div>
                    <div className="my-2">
                        Ngày trả phòng: {dataBooking && dataBooking.checkOutDay}
                    </div>
                    <div className="my-2">
                        Số người lớn: {dataBooking && dataBooking.numberOfAdults}
                    </div>
                    <div className="my-2">
                        Số trẻ em: {dataBooking && dataBooking.numberOfKids}
                    </div>
                    <div className="my-2">
                        Tiền đã thanh toán: {dataBooking && formatCurrency(dataBooking.deposits)}
                    </div>

                    <Divider orientation="left">
                        <span className="font-semibold mr-3">
                            {roomBookingList && roomBookingList.length > 0 ? "Phòng" : "Chưa xếp phòng"}
                            <Button
                                className="px-2.5 ml-2"
                                onClick={() => showModalListRoom()}
                            >
                                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                            </Button>
                        </span>
                    </Divider>

                    {roomBookingList && roomBookingList.length > 0 && (
                        <Table
                            size="middle"
                            locale={{emptyText: "Chưa xếp phòng nào!"}}
                            bordered
                            pagination={false}
                            columns={columnsRoomBookingList}
                            dataSource={roomBookingList}
                        />
                    )}
                    
                    {/* {roomBookingList && roomBookingList.map(
                        (x) => (
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-11 text-base font-semibold border rounded-md py-1 px-2 mb-2 flex items-center">
                                    <div className="border-r-2 border-design-charcoalblack pr-1">
                                        {x.rooms.name}
                                    </div>
                                    <div className="ml-1">
                                        <FontAwesomeIcon
                                            icon={faBuildingCircleCheck}
                                            className="w-[14px] h-[14px] bg-design-charcoalblack rounded-full text-white p-1"
                                        ></FontAwesomeIcon>
                                    </div>
                                    <div className="border-r-2 border-design-charcoalblack pr-1 ml-1">
                                        {x.hireDate}
                                    </div>
                                    <div className="ml-1">
                                        <FontAwesomeIcon
                                            icon={faPersonWalkingArrowRight}
                                            className="w-[14px] h-[14px] bg-design-charcoalblack rounded-full text-white p-1"
                                        ></FontAwesomeIcon>
                                    </div>
                                    <div className="ml-1">
                                        {x.checkOutDay}
                                    </div>
                                </div>
                                <div className="col-span-1 text-base font-semibold border rounded-md py-1 px-2 mb-2 cursor-pointer hover:border-design-greenLight hover:text-design-greenLight">
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                    ></FontAwesomeIcon>
                                </div>
                            </div>
                        )
                    )} */}

                    {/* <Button
                        type="primary"
                        className="w-full mt-3"
                        onClick={() => showModalListRoom()}
                    >
                        Thêm phòng
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="ml-2"
                        ></FontAwesomeIcon>
                    </Button> */}

                    {roomBookingList && roomBookingList.length > 0 && (
                        <>
                            
                            <Divider
                                style={{ marginBottom: 20, marginTop: 20 }}
                            ></Divider>

                            <Radio.Group onChange={(e) => setChooseOption(e.target.value)} value={chooseOption}>
                                <Radio value={"CHECK_IN"} className="text-base">Nhận phòng</Radio>
                                <Radio value={"CANCEL"} className="text-base">Hủy đặt phòng</Radio>
                            </Radio.Group>

                            {chooseOption === "CHECK_IN" && dataBooking && dataBooking.hireDate === dayjs(new Date()).format("YYYY-MM-DD") && (
                                <Button 
                                    size="large"
                                    type="primary" 
                                    className="w-full mt-3" 
                                    onClick={() => {
                                        setInitialValues(
                                            {
                                                'Tên khách hàng': dataBooking.customerName,
                                                'Số điện thoại': dataBooking && dataBooking.customerPhoneNumber,
                                                'Email': dataBooking && dataBooking.customerEmail,
                                                'Số người lớn': dataBooking && dataBooking.numberOfAdults,
                                                'Số trẻ em': dataBooking && dataBooking.numberOfKids,
                                            }
                                        )
                                        setOpenModalCheckIn(true);
                                    }}
                                >
                                    Khách nhận phòng
                                    <FontAwesomeIcon
                                        className="ml-2"
                                        icon={faBuildingCircleCheck}
                                    ></FontAwesomeIcon>
                                </Button>
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
                        </>
                    )}

                    {roomBookingList && roomBookingList.length === 0 && (
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
            <Modal
                title={"Khách nhận phòng"}
                open={openModalCheckIn}
                // onOk={() => checkInBooking()}
                onCancel={() => setOpenModalCheckIn(false)}
                okText="Nhận phòng"
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                style={{ top: 20 }}
            >
                <Form
                    form={form}
                    initialValues={initialValues}
                    name="nest-messages"
                    onFinish={checkInBooking}
                    validateMessages={validateMessages}
                >
                    <div className="text-base">
                        <div className="py-2">
                            <div className="mb-1">
                                Tên khách hàng:
                            </div>
                            <Form.Item
                                name="Tên khách hàng"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    validateMessages.space,
                                    validateMessages.specialCharacters,
                                ]}
                                hasFeedback 
                            >
                                <Input
                                    size="large"
                                    className=""
                                    placeholder="Tên khách hàng..."
                                    prefix={<UserOutlined />}
                                    // value={dataBill && dataBill.customer.fullname}
                                    onChange={
                                        (e) => {
                                            setDataBill({
                                                ...dataBill,
                                                customer: {
                                                    ...dataBill.customer,
                                                    fullname: e.target.value,
                                                }
                                            })
                                        }
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div className="">
                            <div className="mb-1">
                                Ngày sinh:
                            </div>
                            <Form.Item
                                name="Ngày sinh"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                ]}
                                hasFeedback
                            >
                                <DatePicker
                                    size="large"
                                    className="w-full"
                                    format="DD-MM-YYYY"
                                    value={
                                        dataBill && dataBill.customer.dateOfBirth
                                        ? dayjs(dataBill.customer.dateOfBirth)
                                        : ''
                                    }
                                    onChange={
                                        (date, dateString) => {
                                            var newdate = dateString.split('-').reverse().join('-');
                                            setDataBill({
                                                ...dataBill,
                                                customer: {
                                                    ...dataBill.customer,
                                                    dateOfBirth: dateString === '' ? '' : new Date(Date.parse(newdate)),
                                                }
                                            })
                                        }
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div className="">
                            <div className="mb-1">
                                Giới tính:
                            </div>
                            <Select
                                size="large"
                                className="w-full"
                                options={genders}
                                value={
                                    dataBill && dataBill.customer.gender
                                    ? genders.find((x) => x.value === dataBill.customer.gender)
                                    : dataBill && setDataBill({
                                        ...dataBill,
                                        customer: {
                                            ...dataBill.customer,
                                            gender: genders[0].value,
                                        }
                                    })
                                }
                                onChange={
                                    (e) => {
                                        setDataBill({
                                            ...dataBill,
                                            customer: {
                                                ...dataBill.customer,
                                                gender: e,
                                            }
                                        })
                                    }
                                }
                            />
                        </div>
                        <div className="mt-6">
                            <div className="mb-1">
                                Quốc tịch:
                            </div>
                            <Select
                                size="large"
                                className="w-full"
                                options={genNationality()}
                                value={
                                    dataBill && dataBill.customer.nationality
                                    ? genNationality().find((x) => x.value === dataBill.customer.nationality.id).value
                                    : dataBill && setDataBill({
                                        ...dataBill,
                                        customer: {
                                            ...dataBill.customer,
                                            nationality: nationalityList[0],
                                        }
                                    })
                                }
                                onChange={
                                    (e) => {
                                        setDataBill({
                                            ...dataBill,
                                            customer: {
                                                ...dataBill.customer,
                                                nationality: nationalityList.find((x) => x.id === e),
                                            }
                                        })
                                    }
                                }
                            />
                        </div>
                        <div className="mt-6">
                            <div className="mb-1">
                                Số điện thoại:
                            </div>
                            <Form.Item
                                name="Số điện thoại"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                ]}
                                hasFeedback
                            >
                                <Input
                                    size="large"
                                    className="w-full"
                                    placeholder="Số điện thoại..."
                                    prefix={<UserOutlined />}
                                    value={dataBill && dataBill.customer.phoneNumber}
                                    onChange={
                                        (e) => {
                                            setDataBill({
                                                ...dataBill,
                                                customer: {
                                                    ...dataBill.customer,
                                                    phoneNumber: e.target.value,
                                                }
                                            })
                                        }
                                    }
                                />
                            </Form.Item>
                            
                        </div>
                        <div className="mt-6">
                            <div className="mb-1">
                                Email:
                            </div>
                            <Form.Item
                                name="Email"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                ]}
                                hasFeedback
                            >
                                <Input
                                    size="large"
                                    className=""
                                    placeholder="Email..."
                                    prefix={<UserOutlined />}
                                    value={dataBill && dataBill.customer.email}
                                    onChange={
                                        (e) => {
                                            setDataBill({
                                                ...dataBill,
                                                customer: {
                                                    ...dataBill.customer,
                                                    email: e.target.value,
                                                }
                                            })
                                        }
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div className="">
                            <div className="mb-1">
                                Giấy tờ tùy thân:
                            </div>
                            <Form.Item
                                name="Giấy tờ tùy thân"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                ]}
                                hasFeedback
                            >
                                <Input
                                    size="large"
                                    className="w-full"
                                    placeholder="Giấy tờ tùy thân..."
                                    prefix={<UserOutlined />}
                                    value={dataBill && dataBill.customer.citizenIdCode}
                                    onChange={
                                        (e) => {
                                            setDataBill({
                                                ...dataBill,
                                                customer: {
                                                    ...dataBill.customer,
                                                    citizenIdCode: e.target.value,
                                                }
                                            })
                                        }
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div className="mt-6">
                            <div className="mb-1">
                                Địa chỉ:
                            </div>
                            <Form.Item
                                name="Địa chỉ"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                ]}
                                hasFeedback
                            >
                                <Input
                                    size="large"
                                    className="w-full"
                                    placeholder="Địa chỉ..."
                                    prefix={<UserOutlined />}
                                    value={dataBill && dataBill.customer.address}
                                    onChange={
                                        (e) => {
                                            setDataBill({
                                                ...dataBill,
                                                customer: {
                                                    ...dataBill.customer,
                                                    address: e.target.value,
                                                }
                                            })
                                        }
                                    }
                                />
                            </Form.Item>
                        </div>

                        <Divider
                            style={{ marginBottom: 20, marginTop: 20 }}
                        ></Divider>

                        <div className="">
                            <div className="mb-1">
                                Số người lớn:
                            </div>
                            <Form.Item
                                name="Số người lớn"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                ]}
                                hasFeedback
                            >
                                <InputNumber
                                    size="large"
                                    className="w-full"
                                    placeholder="Số người lớn..."
                                    value={dataBill && dataBill.numberOfAdults}
                                    onChange={
                                        (e) => {
                                            setDataBill({
                                                ...dataBill,
                                                numberOfAdults: e
                                            })
                                        }
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div className="mt-6">
                            <span className="mb-1">
                                Số người trẻ em:
                            </span>
                            <Form.Item
                                name="Số trẻ em"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                ]}
                                hasFeedback
                            >
                                <InputNumber
                                    size="large"
                                    className="w-full"
                                    placeholder="Số người trẻ em..."
                                    value={dataBill && dataBill.numberOfKids}
                                    onChange={
                                        (e) => {
                                            setDataBill({
                                                ...dataBill,
                                                numberOfKids: e
                                            })
                                        }
                                    }
                                />
                            </Form.Item>
                            
                        </div>
                        <div className="mt-7">
                            <div className="mb-1">
                                Tiền đặt cọc (Đã thanh toán khi Booking):
                            </div>
                            <InputNumber
                                size="large"
                                className="w-full"
                                placeholder="Tiền đã thanh toán..."
                                disabled
                                value={dataBill && formatCurrency(dataBill.deposits)}
                            />
                        </div>

                        <div className="mt-6">
                            <Button
                                size="large"
                                htmlType="sumbit"
                                type="primary"
                                className="w-full"
                            >Nhận phòng</Button>
                        </div>
                    </div>
                </Form>
            </Modal>
            <Modal 
                width={1800}
                title={"Sơ đồ phòng"}
                open={openModalListRoom}
                onOk={handleOkListRoom}
                onCancel={handleCancelListRoom}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                style={{ top: 20 }}
            >
                <ListRoom
                    optionType={"BOOKING"}
                    openModalListRoom={openModalListRoom}
                    setOpenModalListRoom={setOpenModalListRoom}
                    hireDate={dataBooking && dataBooking.hireDate}
                    kindOfRoomBooking={dataBooking && dataBooking.kindOfRoom.id}
                    dataBooking={dataBooking}
                    setDataBooking={setDataBooking}
                    dataBill={dataBill}
                    setDataBill={setDataBill}
                    roomBookingList={roomBookingList}
                    setRoomBookingList={setRoomBookingList}
                ></ListRoom>
            </Modal>

            <div className="grid grid-cols-2 mb-3">
                <div className="flex items-center">
                    <Checkbox
                        className="mr-3"
                        checked={chooseDateNow}
                        onChange={
                            (e) => setChooseDateNow(e.target.checked)
                        }
                    >Ngày hôm nay ({dayjs(new Date()).format("DD-MM-YYYY")})</Checkbox>
                    <Checkbox
                        className="mr-3"
                        checked={chooseNew}
                        onChange={
                            (e) => setChooseNew(e.target.checked)
                        }
                    >Mới</Checkbox>
                    <Checkbox
                        className="mr-3"
                        checked={chooseDone}
                        onChange={
                            (e) => setChooseDone(e.target.checked)
                        }
                    >Đã xếp phòng</Checkbox>
                    {/* <div className="">Trạng thái</div>
                    <Radio.Group name="radiogroup" defaultValue={1}>
                        <Radio value={1}>Mới</Radio>
                        <Radio value={2}>Đã xếp phòng</Radio>
                    </Radio.Group> */}
                </div>

                <div>
                    <Input
                        className=""
                        placeholder="Search..."
                        prefix={<SearchOutlined />}
                        value={queryCustomerName}
                        onChange={
                            (e) => {
                                setQueryCustomerName(e.target.value);
                            }
                        }
                    />
                </div>
            </div>

            <Table
                size="middle"
                locale={{emptyText: "Chưa có đơn book nào!"}}
                bordered
                pagination={true}
                columns={columns}
                dataSource={genBookingPaidListFilter()}
            />
        </>
    );
}

export default Paid;