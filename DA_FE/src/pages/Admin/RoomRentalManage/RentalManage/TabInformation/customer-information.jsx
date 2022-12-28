import { Button, DatePicker, Divider, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { AuditOutlined, GoogleOutlined, HomeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import validateMessages from '~/config/rules';
// import { QrReader } from 'react-qr-reader';
// import { getBillListIsActive } from '~/app/reducers/SystemManagement/system-management-api';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const genders = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
];
const customerType = [
    { value: 'New', label: 'Mới' },
    { value: 'Using', label: 'Đang sử dụng' },
];
function CustomerInformation({ customer, setCustomer, type, bill, setBill, nationalityList, billActiveList, form, onFinish }) {

    //Data
    const [customerTypeSelected, setCustomerTypeSelected] = useState('New');
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const key = 'messageApi';
    const [messageApi, contextHolder] = message.useMessage();
    const [initialValues, setInitialValues] = useState();
    
    useEffect(() => {
        form.setFieldsValue(initialValues)
    }, [form, initialValues])
    //End Data

    //Created
    useEffect(() => {
        // getBillListIsActive(dispatch);
        if(nationalityList) {
            setCustomer({ ...customer, nationality: nationalityList[0] });
        }
    }, [nationalityList]);
    useEffect(() => {
        if(customer) {
            setInitialValues({
                'Tên khách hàng': customer.fullname ? customer.fullname : "",
                'Ngày sinh': customer.dateOfBirth ? dayjs(customer.dateOfBirth) : "",
                'Số điện thoại': customer.phoneNumber,
                'Email': customer.email,
                'Giấy tờ tùy thân': customer.citizenIdCode,
                'Địa chỉ': customer.address,
                'Số người lớn': bill.numberOfAdults,
                'Số trẻ em': bill.numberOfKids,
                'Đặt cọc': bill.deposits,
            })
        }
    }, [customer, bill])
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
    const genBillListIsActive = () => {
        const array = [];
        if(billActiveList) {
            billActiveList.forEach((element) => {
                array.push({ value: element.id, label: element.customer.fullname + ' - ' + element.customer.phoneNumber });
            });
        }
        return array;
    };
    //End Gen Data

    //Function
    
    const changeCustomer = (value) => {
        if(billActiveList) {
            setCustomer(billActiveList.find((element) => element.id === value).customer);
            setBill(billActiveList.find((element) => element.id === value));
        }
    };
    const changeFullName = (value) => {
        setCustomer({ ...customer, fullname: value });
    };
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {

    };

    const handleCancel = () => {
        setOpen(false);
    };
    //End Function

    //Util
    //End Util


    const [result, setResult] = useState('No result');
    let handleScan = (data) => {
        if (data) {
        setResult(data);
        console.log(data);
        }
    };

    let handleError = (err) => {
        alert(err);
    };

    return (
        <>
            <Modal
                title="QR"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                {/* {open && (
                    <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                    facingMode="environment"
                >{result}</QrReader>
                )} */}
            </Modal>
            <Form
                form={form}
                initialValues={initialValues}
                name="nest-messages"
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <div className="text-base">
                    <Divider orientation="left">
                        <div className="flex justify-center items-center">
                            <div className="text-base font-semibold mr-3">Thông tin khách hàng</div>
                            {type !== "details" && (
                                <Select
                                    className="w-36"
                                    onChange={(e) => {
                                        setCustomerTypeSelected(e);
                                    }}
                                    options={customerType}
                                    value={customerTypeSelected}
                                />
                            )}
                            <Button className='ml-3' onClick={showModal}>QR</Button>
                        </div>
                    </Divider>
                    <div className="grid grid-cols-2 gap-x-6 items-center">
                        <div>
                            <div>Tên khách hàng:</div>
                            {customerTypeSelected === 'New' && (
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
                                        size='large'
                                        onChange={(e) => {
                                            changeFullName(e.target.value);
                                        }}
                                        className={`mt-1`}
                                        placeholder="Name..."
                                        prefix={<UserOutlined />}
                                        value={customer.fullname}
                                        // disabled={type === "details"}
                                    />
                                </Form.Item>
                            )}
                            <Select
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="children"
                                className={`mt-[2px] w-full ${customerTypeSelected === 'Using' ? '' : 'hidden'}`}
                                onChange={changeCustomer}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={billActiveList ? genBillListIsActive() : ""}
                            />
                        </div>
                        <div>
                            <div>Ngày sinh:</div>
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
                                // value={customer.dateOfBirth ? dayjs(customer.dateOfBirth) : ''}
                            >
                                <DatePicker
                                    size='large'
                                    onChange={(date, dateString) => {
                                        var newdate = dateString.split('-').reverse().join('-');
                                        setCustomer({
                                            ...customer,
                                            dateOfBirth: dateString === '' ? '' : new Date(Date.parse(newdate)),
                                        });
                                    }}
                                    className="w-full mt-1"
                                    format="DD-MM-YYYY"
                                    value={customer.dateOfBirth ? dayjs(customer.dateOfBirth) : ''}
                                    // disabled={customerTypeSelected === 'Using' || type === "details"}
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <div>Giới tính:</div>
                            <Select
                                size='large'
                                onChange={(e) => {
                                    setCustomer({ ...customer, gender: e });
                                }}
                                className="w-full mt-1"
                                value={genders.find((element) => element.value === customer.gender)}
                                options={genders}
                                // disabled={customerTypeSelected === 'Using' || type === "details"}
                            />
                        </div>
                        <div>
                            <div>Quốc tịch:</div>
                            <Select
                                size='large'
                                onChange={(e) => {
                                    setCustomer({
                                        ...customer,
                                        nationality: nationalityList.find((element) => element.id === e),
                                    });
                                }}
                                className="w-full mt-1"
                                value={
                                    customer.nationality && nationalityList ? genNationality().find((element) => element.value === customer.nationality.id).value
                                    : nationalityList ? genNationality()[0].value
                                    : ""
                                }
                                options={genNationality()}
                                // disabled={customerTypeSelected === 'Using' || type === "details"}
                            />
                        </div>
                        <div className='mt-6'>
                            <div>Số điện thoại:</div>
                            <Form.Item
                                name="Số điện thoại"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    validateMessages.space,
                                    validateMessages.specialCharacters,
                                    validateMessages.phoneNumber
                                ]}
                                hasFeedback
                            >
                                <Input
                                    size='large'
                                    onChange={(e) => {
                                        setCustomer({ ...customer, phoneNumber: e.target.value });
                                    }}
                                    className="mt-1"
                                    placeholder="Phone..."
                                    prefix={<PhoneOutlined />}
                                    value={customer.phoneNumber || ''}
                                    // disabled={customerTypeSelected === 'Using' || type === "details"}
                                />
                            </Form.Item>
                        </div>
                        <div className='mt-6'>
                            <div>Email:</div>
                            <Form.Item
                                name="Email"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters
                                ]}
                                hasFeedback
                            >
                                <Input
                                    size='large'
                                    onChange={(e) => {
                                        setCustomer({ ...customer, email: e.target.value });
                                    }}
                                    className="mt-[2px]"
                                    placeholder="Email..."
                                    prefix={<GoogleOutlined />}
                                    value={customer.email || ''}
                                    // disabled={customerTypeSelected === 'Using' || type === "details"}
                                />
                            </Form.Item>
                            
                        </div>
                        <div>
                            <div>Giấy tờ tùy thân:</div>
                            <Form.Item
                                name="Giấy tờ tùy thân"
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
                                    size='large'
                                    onChange={(e) => {
                                        setCustomer({ ...customer, citizenIdCode: e.target.value });
                                    }}
                                    className="mt-1"
                                    placeholder="Identification..."
                                    prefix={<AuditOutlined />}
                                    value={customer.citizenIdCode || ''}
                                    // disabled={customerTypeSelected === 'Using' || type === "details"}
                                />
                            </Form.Item>
                            
                        </div>
                        <div>
                            <div>Địa chỉ:</div>
                            <Form.Item
                                name="Địa chỉ"
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
                                    size='large'
                                    onChange={(e) => {
                                        setCustomer({ ...customer, address: e.target.value });
                                    }}
                                    className="mt-1"
                                    placeholder="Adress..."
                                    prefix={<HomeOutlined />}
                                    value={customer.address || ''}
                                    // disabled={customerTypeSelected === 'Using' || type === "details"}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <Divider orientation="left" style={{paddingTop: 12}}>
                        <div className="flex justify-center items-center">
                            <div className="text-base font-semibold mr-3">Thông tin khác</div>
                        </div>
                    </Divider>
                    <div className="grid grid-cols-2 gap-x-6 items-center">
                        <div>
                            <div className='mb-1'>Số người lớn:</div>
                            <Form.Item
                                name="Số người lớn"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                    validateMessages.positiveNumbers
                                ]}
                                hasFeedback
                            >
                                <InputNumber
                                    size='large'
                                    onChange={(e) => {
                                        setBill({ ...bill, numberOfAdults: e });
                                    }}
                                    className="w-full"
                                    placeholder="Number Of Adults..."
                                    prefix={<UserOutlined />}
                                    value={bill.numberOfAdults || 0}
                                    // disabled={customerTypeSelected === 'Using' || type === "details"}
                                />
                            </Form.Item>
                            
                        </div>
                        <div>
                            <div className='mb-1'>Số trẻ em:</div>
                            <Form.Item
                                name="Số trẻ em"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                    validateMessages.positiveNumbers
                                ]}
                                hasFeedback
                            >
                                <InputNumber
                                    size='large'
                                    onChange={(e) => {
                                        setBill({ ...bill, numberOfKids: e });
                                    }}
                                    className="w-full"
                                    placeholder="Number Of Kids..."
                                    prefix={<UserOutlined />}
                                    value={bill.numberOfKids || 0}
                                    // disabled={customerTypeSelected === 'Using' || type === "details"}
                                />
                            </Form.Item>
                            
                        </div>
                        <div>
                            <div className='mb-1'>Đặt cọc:</div>
                            <Form.Item
                                name="Đặt cọc"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    // validateMessages.space,
                                    // validateMessages.specialCharacters,
                                    validateMessages.positiveNumbers
                                ]}
                                hasFeedback
                            >
                                <InputNumber
                                    size='large'
                                    onChange={(e) => {
                                        setBill({ ...bill, deposits: e ? e : 0 });
                                    }}
                                    className="w-full"
                                    placeholder="Deposits..."
                                    value={bill.deposits || 0}
                                    // disabled={customerTypeSelected === 'Using' || type === "details"}
                                    addonAfter="VND"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
}

export default CustomerInformation;
