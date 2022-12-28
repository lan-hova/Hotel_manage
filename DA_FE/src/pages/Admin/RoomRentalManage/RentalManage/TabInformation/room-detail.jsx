import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined, SyncOutlined, InfoOutlined, InfoCircleTwoTone, InfoCircleFilled } from '@ant-design/icons';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, DatePicker, Divider, InputNumber, Select, Skeleton, Avatar } from 'antd';
import Meta from 'antd/es/card/Meta';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
const { RangePicker } = DatePicker;

function RoomDetail({ detailInvoice, detailInvoiceList, setDetailInvoices, showModalDetailInvoice, setDetailModalDetailInvoice, showModalRoomDetail, rentalTypeList, dateNow }) {
    
    //Data
    //End Data

    //Created
    //End Created

    //Gen Data
    //End Gen Data

    //Function
    
    const chooseDetailModalDetailInvoice = async (type) => {
        await setDetailModalDetailInvoice(detailInvoice);
        if(type === "edit") {
            showModalDetailInvoice();
        }
        if(type === "detail") {
            showModalRoomDetail();
        }
    }
    //End Function

    //Util
    const formatCurrency = (value) => {
        return value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    };
    const formatDateTime = (value) => {
        let arrayDateTime = value.split(' ');
        let arrayDate = arrayDateTime[0].split('-');
        return arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0] + ' ' + arrayDateTime[1];
    };
    const genDayRental = (value) => {
        let d1 = dateNow.getTime();
        let d2 = new Date(value).getTime();
        return Math.ceil((d1 - d2) / (24 * 60 * 60 * 1000));
    };

    const genHourRental = (value) => {
        let d1 = dateNow.getTime();
        let d2 = new Date(value).getTime();
        return (d1 - d2) / (60 * 60 * 1000);
    };
    //End Util

    // console.log(detailInvoice);


    return (
        <div className='text-base'>
            <Card
                actions={[
                    <EditOutlined onClick={ () => chooseDetailModalDetailInvoice("edit") } key="edit" />,
                    <InfoCircleFilled onClick={ () => chooseDetailModalDetailInvoice("detail") } key="detail"/>,
                    <SyncOutlined key="change"/>
                ]}
            >
                <div className='flex items-center'>
                    <div className='bg-design-greenLight rounded-full p-2 text-white h-10 w-10 flex justify-center items-center'>
                        <FontAwesomeIcon icon={faBed} ></FontAwesomeIcon>
                    </div>
                    <div className='ml-3'>
                        <div className='text-lg font-semibold'>{detailInvoice.rooms.name}</div>
                        <div className='text-base'>{detailInvoice.rooms.kindOfRoom.name}</div>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='rounded-full p-2 h-10 w-10 text-white flex justify-center items-center'>
                    </div>
                    <div className='ml-3 text-base'>
                        Loại hình thuê:&nbsp;
                        <span className='font-semibold'>
                            { detailInvoice.rentalTypes ? detailInvoice.rentalTypes.name : "" }
                        </span>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='rounded-full p-2 h-10 w-10 text-white flex justify-center items-center'>
                    </div>
                    <div className='ml-3 text-base'>
                        Ngày & Giờ Check in:&nbsp;
                        <span className='font-semibold'>
                            { detailInvoice.hireDate ? moment(detailInvoice.hireDate).format("DD-MM-YYYY HH:mm") : "" }
                        </span>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='rounded-full p-2 h-10 w-10 text-white flex justify-center items-center'>
                    </div>
                    <div className='ml-3 text-base'>
                        Ngày & Giờ Check out:&nbsp;
                        <span className='font-semibold'>
                            { detailInvoice.hireDate ? moment(detailInvoice.checkOutDay).format("DD-MM-YYYY HH:mm") : "" }
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default RoomDetail;
