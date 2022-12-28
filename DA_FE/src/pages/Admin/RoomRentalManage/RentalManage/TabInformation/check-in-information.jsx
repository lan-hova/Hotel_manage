import { DollarCircleOutlined, AuditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Divider, DatePicker, Select, Input, Table, Descriptions, Badge, Modal, Drawer, Button, Radio, Space, message, InputNumber, Form } from 'antd';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '~/pages/Loading/loading';
import { toast } from 'react-toastify';
const { RangePicker } = DatePicker;
const { confirm } = Modal;

function CheckInInformation({ bill, setBill, detailInvoices, serviceDetails, type, open, setOpen, dateNow, rentalTypeList, checkData }) {

    //Data
    const columnDetailInVoice = [
        { title: 'Phòng', dataIndex: 'room', key: '1',
            render: (room, element) => <div onClick={() => changeChooseDetailInvoice(element.roomId)} className='font-semibold cursor-pointer hover:text-design-greenLight'>{room} <FontAwesomeIcon icon={faCircleExclamation}></FontAwesomeIcon></div>
        },
        { title: 'Loại hình', dataIndex: 'rentalType', key: '2' },
        { title: 'Tổng thời gian', dataIndex: '', key: '3',
            render: (time, element) => 
                <span>
                    {element.rentalType === "Theo ngày" ? element.day + " (Ngày)" : element.hour + " (Giờ)"}
                </span>
        },
        // { title: 'Trạng thái', dataIndex: 'statusTT', key: '4',
        //     render: (statusTT) => <span>{statusTT}</span>,
        // },
        { title: 'Tổng tiền phòng', dataIndex: 'allMoneyRoom', key: '6',
            render: (allMoney) => <span>{formatCurrency(allMoney)}</span>,
        },
        { title: 'Phụ thu', dataIndex: 'surcharge', key: '5',
            render: (surcharge) => <span>{formatCurrency(surcharge)}</span>,
        },
        { title: 'Tổng tiền dịch vụ', dataIndex: 'allMoneyService', key: '7',
            render: (allMoneyService) => <span>{formatCurrency(allMoneyService)}</span>,
        },
        { title: 'Trạng thái', dataIndex: 'status', key: '8',
            render: (status) => <span>{status === 1 ? "Đang hoạt động" : "Xong"}</span>,
        },
    ];
    const columnSerViceByRoom = [
        { title: 'Dịch vụ', dataIndex: 'servicess', key: '1',
            render: (servicess) => <div>{servicess.name}</div>,
        },
        { title: 'Loại dịch vụ', dataIndex: 'servicess', key: '2',
            render: (servicess) => <div>{servicess.serviceType.name}</div>,
        },
        { title: 'Đơn giá', dataIndex: 'servicess', key: '3',
            render: (servicess) => <div>{formatCurrency(servicess.prices)}</div>,
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: '4' },
        { title: 'Tổng tiền', dataIndex: 'totalCash', key: '5',
            render: (totalCash, element) => <div>{formatCurrency(element.servicess.prices * element.quantity)}</div>,
        },
    ];
    const [chooseDetailInvoice, setChooseDetailInvoice] = useState();
    const [showModalDetailInvoice, setShowModalDetailInvoice] = useState(false);
    const navigate = new useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'messageApi';
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [radioValue, setRadioValue] = useState("tienmat");
    const [disableCustomerPay, setDisableCustomerPay] = useState(radioValue === "tienmat" ? false : true);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState();

    useEffect(() => {
        form.setFieldsValue(initialValues)
    }, [form, initialValues])
    const validateMessages = {
        required: 'Vui lòng nhập ${label}!',
        types: {
        email: '${label} không đúng định dạng!',
        number: '${label} is not a valid number!',
        },
        number: {
        range: '${label} must be between ${min} and ${max}',
        },
        phoneNumber: {
            validator: (_, value) => {
                if(value) {
                    if(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject(_.field + ' chưa đúng!');
                }
                return Promise.resolve();
            }
        },
        space: {
            validator: (_, value) => {
                if(value) {
                    if(/^[^\s]+(\s+[^\s]+)*$/.test(value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject(_.field + ' không được để trống!');
                }
                return Promise.resolve();
            }
        },
        specialCharacters: {
            validator: (_, value) => {
                if(value) {
                    if(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
                        return Promise.reject(_.field + ' không được có ký tự đặc biệt!');
                    }
                    return Promise.resolve();
                }
                return Promise.resolve();
            }
        },
        positiveNumbers: {
            validator: (_, value) => {
                if(value) {
                    if(value < 0) {
                        return Promise.reject(_.field + ' phải là số dương!');
                    }
                    return Promise.resolve();
                }
                return Promise.resolve();
            }
        },
        sosanh: {
            validator : (_, value) => {
                if(value) {
                    if(value < genTotalPayable()) {
                        return Promise.reject(_.field + ' phải lớn hơn hoặc bằng tiền khách cần trả!');
                    }
                    return Promise.resolve();
                }
                return Promise.resolve();
            }
        }
    };
    //End Data

    //Created
    //End Created

    //Gen Data
    const genRentalType = () => {
        const array = [];
        if(rentalTypeList) {
            rentalTypeList.forEach((element) => {
                array.push({ value: element.id, label: element.name });
            });
        }
        return array;
    };
    const genDataTable = () => {
        const array = [];
        let key = 0;
        if(detailInvoices){
            detailInvoices.forEach(element =>{
                const e = {};
                e.roomId = element.rooms.id;
                e.room = element.rooms.name;
                e.rentalType = element.rentalTypes.name;
                e.hour = genHourRental(element.hireDate);
                e.day = genDayRental(element.hireDate);
                e.price = element.rentalTypes.id === 1 ? Number(element.rooms.kindOfRoom.priceByDay) : Number(element.rooms.kindOfRoom.hourlyPrice);
                e.allMoneyRoom = element.status === 4 ? element.totalCash : element.rentalTypes.id === 1 ? Number(e.price * e.day) : Number(e.price * e.hour);
                e.allMoneyService = genAllMoneyServiceByRoom(element.rooms.id);
                e.surcharge = element.status === 4 ? 0 : genSurchargeByRoom(element.rentalTypes.name, element.checkOutDay, element.rentalTypes.id === 1 ? Number(e.price * e.day) : Number(e.price * e.hour));
                e.statusTT = genStatus(element.rentalTypes.name, element.checkOutDay);
                e.key = key++;
                e.status = element.status;
                e.id = element.id;
                array.push(e);
            })
        }
        return array;
    }
    const genAllMoneyServiceByRoom = (idRoom) => {
        let allMoneyServiceByRoom = 0;
        if(serviceDetails) {
            serviceDetails.forEach(element => {
                if(element.detailsInvoice.rooms.id === idRoom) {
                    allMoneyServiceByRoom += Number(element.quantity * element.servicess.prices)
                }
            })
        }
        return allMoneyServiceByRoom;
    }
    const genAllMoneyService = () => {
        let allMoneyService = 0;
        if(genDataTable()){
            genDataTable().forEach(element => {
                allMoneyService += Number(element.allMoneyService);
            })
        }
        return allMoneyService;
    }
    const genSurcharge = () => {
        let allMoneySurcharge = 0;
        if(genDataTable()){
            genDataTable().forEach(element => {
                allMoneySurcharge += Number(element.surcharge);
            })
        }
        return allMoneySurcharge;
    }
    const genAllMoneyRoom = () => {
        let allMoneyRoom = 0;
        if(genDataTable()){
            genDataTable().forEach(element => {
                allMoneyRoom += Number(element.allMoneyRoom);
            })
        }
        return allMoneyRoom;
    }
    const genAllMoney = () => {
        let allMoney = 0;
        if(genDataTable()){
            genDataTable().forEach(element => {
                allMoney += (Number(element.allMoneyRoom) + Number(element.allMoneyService) + Number(element.surcharge));
            })
        }
        allMoney = allMoney + (allMoney * 10 / 100);
        return allMoney;
    }

    const genVAT = () => {
        let allMoney = 0;
        if(genDataTable()){
            genDataTable().forEach(element => {
                allMoney += (Number(element.allMoneyRoom) + Number(element.allMoneyService) + Number(element.surcharge));
            })
        }
        allMoney = allMoney * 10 /100;
        return allMoney;
    }

    const genSurchargeByRoom = (type, dateTimeCheckOut, allMoneyRoom) => {
        let surchargeByRoom = 0;
        let d1 = dateNow.getTime();
        let d2 = new Date(dateTimeCheckOut).getTime();
        if(type === "Theo ngày") {
            if(d1 > d2) {
                surchargeByRoom = allMoneyRoom * 10 / 100;
            }
        }
        return surchargeByRoom;
    }
    const genStatus = (type, dateTimeCheckOut) => {
        let status = "Bình thường";
        let d1 = dateNow.getTime();
        let d2 = new Date(dateTimeCheckOut).getTime();
        if(type === "Theo ngày") {
            if(d1 > d2) {
                status = "Muộn Check out!"
            }
        }
        return status;
    }
    const genDayRental = (dateTimeCheckIn) => {
        let d1 = dateNow.getTime();
        let d2 = new Date(dateTimeCheckIn).getTime();
        return Math.ceil((d1 - d2) / (24*60*60*1000));
    }
    const genHourRental = (dateTimeCheckIn) => {
        let d1 = dateNow.getTime();
        let d2 = new Date(dateTimeCheckIn).getTime();
        return Math.ceil((d1 - d2) / (60*60*1000));
    }
    const genServiceDetailsByRoom = (roomId) => {
        if (serviceDetails)
            return serviceDetails.filter(
                (element) => element.detailsInvoice.rooms.id === roomId && element.quantity !== 0,
            );
    };
    const genTotalPayable = () => {
        let totalPayable = 0;
        if(bill) {
            if(bill.deposits >= genAllMoney()) {
                totalPayable = 0;
            } else {
                totalPayable = genAllMoney() - bill.deposits;
            }
        }
        return totalPayable;
    }
    //End Gen Data

    //Function
    const changeTime = (date, dateString) => {
        setBill({ ...bill, hireDate: formatDateTime(dateString[0]), checkOutDay: formatDateTime(dateString[1]) });
    };
    const changeChooseDetailInvoice = (roomId) => {
        setShowModalDetailInvoice(true);
        setChooseDetailInvoice(detailInvoices.find(element => element.rooms.id === roomId));
    }
    const cancelModalDetailInvoice = () => {
        setChooseDetailInvoice();
        setShowModalDetailInvoice(false);
    }
    const pay = async () => {
        let detailInvoiceList = detailInvoices;
        detailInvoiceList.forEach(element => {
            element.numberOfDaysOfRent = genDataTable().find(element2 => element2.roomId === element.rooms.id).day;
            element.numberOfHoursToRent = genDataTable().find(element2 => element2.roomId === element.rooms.id).hour;
            element.totalCash = genAllMoney();
            element.status = 2;
        })
        let serviceDetailList = serviceDetails;
        serviceDetailList.forEach(element => {
            element.status = 2;
        })
        // console.log(detailInvoiceList);
        // console.log(serviceDetailList);
        let billRequest = bill;
        billRequest.totalCash = genTotalPayable();
        billRequest.dateOfPayment = dayjs(dateNow).format('YYYY-MM-DD HH:mm');
        // console.log(billRequest);
        setConfirmLoading(true);
        const response = await axios.post('http://localhost:8080/api/room-rental-manage/pay', {
                detailInvoices: detailInvoiceList,
                serviceDetails: serviceDetailList,
                bill: billRequest,
            }).then(res => {
                if(res) {
                    setTimeout(() => {
                        setConfirmLoading(false);
                        // messageApi.open({
                        //     key,
                        //     type: 'success',
                        //     content: 'Cập nhật thành công!',
                        //     duration: 2,
                        // });
                        toast.success('Thanh toán thành công!', { autoClose: 2000 });
                        navigate('/admin/room-plan');
                    }, 1000);
                }
            }).catch(err => {
                setTimeout(() => {
                    setConfirmLoading(false);
                    // messageApi.open({
                    //     key,
                    //     type: 'error',
                    //     content: 'Lỗi, vui lòng kiểm tra lại!',
                    //     duration: 2,
                    // });
                }, 1000);
            }).finally(() => {
                
            });
    }
    const changePaymentType = (value) => {
        setRadioValue(value);
        if(value === "tienmat") {
            setDisableCustomerPay(false);
            setBill({ ...bill, customerPay: 0, customerReturnMoney: 0 });
            setInitialValues({
                'Khách thanh toán': "",
            })
        }
        if(value === "the" || value === "chuyenkhoan") {
            setDisableCustomerPay(true);
            setBill({ ...bill, customerPay: genAllMoney(), customerReturnMoney: 0 });
            setInitialValues({
                'Khách thanh toán': genAllMoney(),
            })
        }
    }
    const payDetailInvoice = async () => {
        setIsLoading(true);
        let data = genDataTable().find((x) => x.id === chooseDetailInvoice.id);
        const params = {
            ...chooseDetailInvoice,
            status: 4,
            totalCash: Number(data.allMoneyRoom) + Number(data.surcharge),
        }
        await axios
            .post('http://localhost:8080/api/room-rental-manage/pay-detail-invoice', params)
            .then(res => {
                if(res) {
                    setTimeout(() => {
                        checkData();
                        setIsLoading(false);
                        setShowModalDetailInvoice(false);
                        toast.success('Cập nhật thành công!', { autoClose: 2000 });
                    }, 500);
                }
            })
            .catch(err => {});
    }
    //End Function

    //Util
    const formatNumber = (value) => {
        return value.toLocaleString('fullwide', { useGrouping: false }).replace(/\.0+$/,'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const formatCurrency = (value) => {
        return value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    };
    const formatDateTime = (value) => {
        let arrayDateTime = value.split(' ');
        let arrayDate = arrayDateTime[0].split('-');
        return arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0] + ' ' + arrayDateTime[1];
    };
    //End Util

    // console.log(bill);

    return <>
        {contextHolder}
        {isLoading && (<Loading></Loading>)}
        {type === "details" && (
            <Drawer
                title="Thanh toán hóa đơn"
                placement="right"
                width={500}
                onClose={() => setOpen(false)}
                open={open}
                extra={
                    <Space>
                        {dayjs(new Date).format('DD-MM-YYYY HH:mm')}
                    </Space>
                }
            >
                <div className='mb-6'>Khách hàng: <span className='font-semibold ml-3'>{bill.customer && bill.customer.fullname}</span></div>
                <div className='grid grid-cols-2'>
                    <div className='text-left'>
                        <div className=''>
                            Tổng tiền phòng
                        </div>
                        <div className='my-6'>
                            Tổng phụ thu
                        </div>
                        <div className='my-6'>
                            Tổng tiền dịch vụ
                        </div>
                        <div className='my-6'>
                            VAT (10%)
                        </div>
                        <div className='my-6'>
                            Tổng tiền
                        </div>
                        <div className='my-6'>
                            Khách đặt cọc
                        </div>
                        <div className='my-6'>
                            Giảm giá
                        </div>
                        <div className='my-6'>
                            Tiền khách cần trả
                        </div>
                        {/* <div className='my-6'>
                            Khách thanh toán
                        </div> */}
                        
                    </div>
                    <div className='text-right font-semibold'>
                        <div>{formatCurrency(genAllMoneyRoom())}</div>
                        <div className='my-6'>{formatCurrency(genSurcharge())}</div>
                        <div className='my-6'>{formatCurrency(genAllMoneyService())}</div>
                        <div className='my-6'>{formatCurrency(genVAT())}</div>
                        <div className='my-6'>{formatCurrency(genAllMoney())}</div>
                        <div className='my-6'>{bill && formatCurrency(bill.deposits)}</div>
                        <div className='my-6'>0%</div>
                        <div className='my-6'>{formatCurrency(genTotalPayable())}</div>
                        {/* <div className='my-6'>
                            <InputNumber
                                onChange={(e) => {
                                    setBill({ ...bill, customerPay: e, customerReturnMoney: e >= genTotalPayable() ? e - genTotalPayable() : 0 });
                                }}
                                className="mt-[2px] w-full"
                                value={bill.customerPay || 0}
                                disabled={disableCustomerPay || bill.deposits > genAllMoney()}
                                addonAfter="VND"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </div> */}
                    </div>
                    <div className='col-span-2'>
                        <div className='text-base mb-1'>Khách thanh toán</div>
                        <Form
                            name="pay"
                            form={form}
                            onFinish={pay}
                            validateMessages={validateMessages}
                            className="mt-3"
                            initialValues={initialValues}
                        >
                            <Form.Item
                                name="Khách thanh toán"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                    validateMessages.positiveNumbers,
                                    validateMessages.sosanh
                                ]}
                                hasFeedback
                            >
                                <InputNumber
                                    onChange={(e) => {
                                        setBill({ ...bill, customerPay: e, customerReturnMoney: e >= genTotalPayable() ? e - genTotalPayable() : 0 });
                                    }}
                                    className="w-full"
                                    value={bill.customerPay || 0}
                                    disabled={disableCustomerPay || bill.deposits > genAllMoney()}
                                    addonAfter="VND"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                            
                        </Form>
                        
                    </div>
                    <div className='text-left'>
                        <div className='my-6'>
                            Trả lại khách
                        </div>
                    </div>
                    <div className='text-right font-semibold'>
                        <div className='my-6'>{bill.deposits > genAllMoney() ? formatCurrency(Number(bill.deposits) - Number(genAllMoney())) : formatCurrency(bill.customerReturnMoney)}</div>
                    </div>
                </div>
                <div className='my-6'>
                    <Radio.Group disabled={bill.deposits > genAllMoney()} value={radioValue} onChange={(e) => changePaymentType(e.target.value)}>
                        <Radio value="tienmat">
                            Tiền mặt
                        </Radio>
                        <Radio value="the">
                            Thẻ
                        </Radio>
                        <Radio value="chuyenkhoan">
                            Chuyển khoản
                        </Radio>
                    </Radio.Group>
                </div>
                <Button onClick={() =>{
                    if(bill.deposits < genTotalPayable()) {
                        form.submit()
                    } else {
                        pay();
                    }
                }} type='primary' className='w-full h-auto text-lg font-semibold' loading={confirmLoading}>
                    <FontAwesomeIcon icon={faMoneyCheckDollar} className="mr-3"></FontAwesomeIcon>
                    Thanh toán
                </Button>
            </Drawer>
        )}
        <Modal
            title="Hóa đơn chi tiết phòng"
            style={{ top: 20 }}
            open={ showModalDetailInvoice }
            cancelButtonProps={{ style: { display: 'none' } }}
            // confirmLoading={confirmLoading}
            onOk={() => {
                confirm({
                    title: 'Bạn có chắc chắn khách muốn trả phòng?',
                    icon: <ExclamationCircleFilled />,
                    // content: 'Some descriptions',
                    onOk() {
                        payDetailInvoice();
                    },
                    onCancel() {
                      
                    },
                    okText: 'Xác nhận',
                    cancelText: 'Hủy'
                });
                
            }}
            onCancel={() => cancelModalDetailInvoice()}
            okText="Khách trả phòng"
        >
            {showModalDetailInvoice && (
                <>
                    <Divider orientation="left">
                        <div className="text-base font-semibold">Thông tin phòng</div>
                    </Divider>
                    <div className="mt-3">
                        Phòng: 
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && chooseDetailInvoice.rooms.name}</span>
                    </div>
                    <div className="mt-3">
                        Loại phòng: 
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && chooseDetailInvoice.rooms.kindOfRoom.name}</span>
                    </div>
                    <div className="mt-3">
                        Giá theo giờ: 
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && formatCurrency(chooseDetailInvoice.rooms.kindOfRoom.hourlyPrice)}</span>
                    </div>
                    <div className="mt-3">
                        Giá theo ngày: 
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && formatCurrency(chooseDetailInvoice.rooms.kindOfRoom.priceByDay)}</span>
                    </div>
                    <Divider orientation="left">
                        <div className="text-base font-semibold">Thông tin thuê phòng</div>
                    </Divider>
                    <div className="mt-3">
                        Loại hình thuê:  
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && chooseDetailInvoice.rentalTypes.name}</span>
                    </div>
                    <div className="mt-3">
                        Ngày check in: 
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && formatDateTime(chooseDetailInvoice.hireDate)}</span>
                    </div>
                    <div className="mt-3">
                        Ngày check out (Dự kiến): 
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && formatDateTime(chooseDetailInvoice.checkOutDay)}</span>
                    </div>
                    <div className="mt-3">
                        Ngày check out (Thực tế): 
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && dayjs(new Date).format('DD-MM-YYYY HH:mm')}</span>
                    </div>
                    <div className="mt-3">
                        Trạng thái: 
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && chooseDetailInvoice.rentalTypes.name === "Theo ngày" ? genStatus(chooseDetailInvoice.rentalTypes.name, chooseDetailInvoice.checkOutDay) : "Bình thường" }</span>
                    </div>
                    <div className="mt-3">
                        Thời gian thuê: 
                        <span className="ml-3 font-semibold">
                            {chooseDetailInvoice && chooseDetailInvoice.rentalTypes.name === "Theo ngày" ? genDayRental(chooseDetailInvoice.hireDate) + " Ngày" : genHourRental(chooseDetailInvoice.hireDate) + " Giờ"}
                        </span>
                    </div>
                    <div className="mt-3">
                        Tổng tiền phòng:
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && genDataTable() && formatCurrency(genDataTable().find(element => element.roomId === chooseDetailInvoice.rooms.id).allMoneyRoom)}</span>
                    </div>
                    <div className="mt-3">
                        Phụ thu:
                        <span className="ml-3 font-semibold">{chooseDetailInvoice && genDataTable() && formatCurrency(genDataTable().find(element => element.roomId === chooseDetailInvoice.rooms.id).surcharge)}</span>
                    </div>
                    <Divider orientation="left">
                        <div className="text-base font-semibold">Thông tin dịch vụ</div>
                    </Divider>
                    <Table 
                        className='mb-6'
                        size="middle"
                        locale={{emptyText: "Chưa có dịch vụ nào!"}}
                        bordered
                        pagination={false}
                        columns={columnSerViceByRoom}
                        dataSource={ chooseDetailInvoice ? genServiceDetailsByRoom(chooseDetailInvoice.rooms.id) : ""}
                        footer={() =>
                        <div className='text-base font-semibold grid grid-cols-2'>
                            <div className='text-left font-normal'>
                                Tổng tiền: 
                            </div>
                            <div className='text-right'>
                                {chooseDetailInvoice && formatCurrency(genAllMoneyServiceByRoom(chooseDetailInvoice.rooms.id))}
                            </div>
                        </div>}
                    />
                </>
            )}
        </Modal>
        <div>
            <Divider orientation="left">
                <div className="text-base font-semibold">Hóa đơn</div>
            </Divider>
            <Table
                size="middle"
                bordered
                pagination={false}
                columns={columnDetailInVoice}
                dataSource={type === "check-in" ? "" : genDataTable()}
                locale={{emptyText: "Khách hàng chưa thuê phòng nào!"}}
                footer={type === "details" ? () => (
                        <div className='text-base font-semibold grid grid-cols-2'>
                            <div className='text-left font-normal'>
                                <div>Tổng tiền phòng</div>
                                <div className='mt-3'>Tổng tiền phụ thu</div>
                                <div className='mt-3'>Tổng tiền dịch vụ</div>
                                <div className='mt-3'>Tổng tiền</div>
                            </div>
                            <div className='text-right'>
                                <div>{formatCurrency(genAllMoneyRoom())}</div>
                                <div className='mt-3'>{formatCurrency(genSurcharge())}</div>
                                <div className='mt-3'>{formatCurrency(genAllMoneyService())}</div>
                                <div className='mt-3'>{formatCurrency(genAllMoney())}</div>
                            </div>
                        </div>
                    )
                    : false
                }
            />
        </div>
    </>
}

export default CheckInInformation;
