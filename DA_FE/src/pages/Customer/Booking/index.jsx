import { Link } from 'react-router-dom';
import config from '~/config';

import { faCheck, faChevronRight, faDoorOpen, faTree, faWifi, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllKindOfRoom } from '~/app/reducers/kindOfRoom';
// import { addboking } from '~/app/reducers/booking'
// import { getcheckInday, getvalueDay, getCheckOutday } from '~/app/reducers/seach';

import Footer from '~/layouts/Customer/Footer';
import Header from '~/layouts/Customer/Header';

function Booking() {
    const room = useSelector((state) => state.room.room);
    const cutomer = useSelector((state) => state.customer.customer);
    const checkInday = useSelector((state) => state.booking.checkInday2);
    const valueDay = useSelector((state) => state.booking.valueDay2);
    const checkOutday = useSelector((state) => state.booking.CheckOutday2);
    const [booking, setbooking] = useState();
    const [prices, setprices] = useState();
    const [name, setname] = useState(cutomer.fullname);
    const [mobinumber, setmobinumber] = useState(cutomer.phoneNumber);
    const [emailaddress, setaddress] = useState(cutomer.email);
    const [citizenIdCode, setcitizenIdCode] = useState(cutomer.citizenIdCode);

    const dispatch = useDispatch();
    console.log(room.kindOfRoom.priceByDay);
    console.log(valueDay);
    const [price, setUrl] = useState(room.kindOfRoom.priceByDay * valueDay);

    const FacilityDetail = useSelector((state) => state.facilityDetail.facilityDetail);

    const url =
        'http://localhost:8080/booking-pay/' +
        checkInday +
        '/' +
        checkOutday +
        '/' +
        room.kindOfRoom.id +
        '/' +
        cutomer.id +
        '/' +
        name +
        '/' +
        mobinumber +
        '/' +
        emailaddress +
        '/' +
        citizenIdCode +
        '?amount=' +
        price +
        '&bankcode=&language=vi&txt_billing_mobile=Thanh+toan+don+hang&txt_billing_email=' +
        room.email +
        '&txt_billing_fullname=' +
        room.name +
        '%20anh&txt_inv_addr1=ha%20noi&txt_bill_city=ha%20noi&txt_bill_country=viet%20nam&txt_bill_state=ha%20noi&txt_inv_mobile=0389355471&txt_inv_email=quanganhsaker@gmail.com&txt_inv_customer=Nguy%E1%BB%85n%20Van%20A&txt_inv_addr1=ha%20noi&city&txt_inv_company=fsoft&txt_inv_taxcode=10&cbo_inv_type=other&vnp_OrderType=other&vnp_OrderInfo=order%20info%20test';
    console.log(url);
    useEffect(() => {
        dispatch(getAllKindOfRoom());
    }, []);

    function handleAdd() {
        window.open(
            url,
            'mywindow',
            'location=1,status=1,scrollbars=1, resizable=1, directories=1, toolbar=1, titlebar=1',
        );
    }
    return (
        <div>
            <Header />
            <div className="mx-36 mt-5 p-2 bg-slate-200 rounded-md">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link to={config.routes.home} className="ml-1 text-sm">
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faChevronRight} />
                                <span className="px-2">Tìm kiếm phòng</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faChevronRight} />
                                <span className="px-2">Chi tiết phòng</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faChevronRight} />
                                <span className="px-2">Booking</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="grid grid-cols-3 gap-6 mx-36 mt-10">
                <div className="col-start-1 col-end-3 border-2 border-slate-200 rounded-md p-5">
                    <h5 className="font-bold">Thông tin chi tiết phòng</h5>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="mt-4">
                            <img className="object-cover rounded-md" src={room.img} alt="" />
                        </div>
                        <p className="mt-4">
                            Phòng nghỉ này có Wi-Fi miễn phí trong tất cả các phòng giúp dễ dàng kết nối và đỗ xe miễn
                            phí. Nằm ở vị trí trung tâm tại Nusa Penida của Bali, chỗ nghỉ này đặt quý khách ở gần các
                            điểm thu hút và tùy chọn ăn uống thú vị. Đừng rời đi trước khi ghé thăm Sacred Monkey Forest
                            Sanctuary nổi tiếng. Được xếp hạng 4 sao, chỗ nghỉ chất lượng cao này cho phép khách nghỉ sử
                            dụng mát-xa, bể bơi ngoài trời và nhà hàng ngay trong khuôn viên.
                        </p>
                    </div>

                    <h5 className="font-bold mt-3">Điểm nhấn nổi bật</h5>
                    <div className="grid grid-cols-3 mt-4">
                        <div>
                            <FontAwesomeIcon icon={faDoorOpen} color="blue" />
                            <span className="mx-2">Nhận phòng 24h</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faTree} color="green" />
                            <span className="mx-2">Phong cảnh tuyệt vời</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faWifi} color="red" />
                            <span className="mx-2">Wifi miễn phí</span>
                        </div>
                    </div>
                    <h5 className="font-bold mt-3">Facilities</h5>
                    <div className="grid grid-cols-3 mt-4">
                        {FacilityDetail.map((f) => (
                            <div key={f.id}>
                                <FontAwesomeIcon icon={faWarehouse} color="blue" />
                                <span className="mt-4 mx-3 ">{f.facilities.name}</span>
                            </div>
                        ))}
                    </div>
                    <h5 className="font-bold text-xl text-red-500 mt-6">
                        Giá phòng : {room?.kindOfRoom?.priceByDay || ''} \1 Đêm
                    </h5>
                </div>
                <div className="border-2 border-slate-200 rounded-md p-5">
                    <h5 className="font-bold">Thông tin người đặt</h5>
                    <div className="mt-4">
                        <label htmlFor="" className="mb-2 mr-3 text-gray-900 dark:text-gray-300 font-bold">
                            Tên người nhận phòng :
                        </label>
                        <input
                            onChange={(e) => {
                                setname(e.target.value);
                            }}
                            type="text"
                            id="nameRoom"
                            name="nameRoom"
                            defaultValue={cutomer.fullname || ''}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="" className="mb-2 mr-3 text-gray-900 dark:text-gray-300 font-bold">
                            Số điện thoại :
                        </label>
                        <input
                            onChange={(e) => {
                                setmobinumber(e.target.value);
                            }}
                            type="text"
                            id="SDT"
                            name="SDT"
                            defaultValue={cutomer.phoneNumber || ''}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="" className="mb-2 mr-3 text-gray-900 dark:text-gray-300 font-bold">
                            Địa chỉ Email :
                        </label>
                        <input
                            onChange={(e) => {
                                setaddress(e.target.value);
                            }}
                            type="text"
                            id="SDT"
                            name="SDT"
                            defaultValue={cutomer.email || ''}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="" className="mb-2 mr-3 text-gray-900 dark:text-gray-300 font-bold">
                            Số chứng minh thư :
                        </label>
                        <input
                            onChange={(e) => {
                                setcitizenIdCode(e.target.value);
                            }}
                            type="text"
                            id="SDT"
                            name="SDT"
                            defaultValue={cutomer.citizenIdCode || ''}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 mx-36 mt-5">
                <div className="col-start-1 col-end-3">
                    <div className="border-2 border-slate-200 rounded-md p-5">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <img className="object-cover h-full rounded-lg" src={room.img} alt="" />
                            </div>
                            <div className="col-start-2 col-end-4">
                                <h5 className="font-bold mt-3 mb-2">Lợi ích có sẵn</h5>
                                <ul>
                                    <li>
                                        <FontAwesomeIcon icon={faCheck} color="green" className="mr-2" />
                                        Miễn phí bữa sáng
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faCheck} color="green" className="mr-2" />
                                        Miễn phí hồ bơi
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faCheck} color="green" className="mr-2" />
                                        Miễn phí phòng tập thể dục
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faCheck} color="green" className="mr-2" />
                                        Check in: {checkInday} from 12h00
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faCheck} color="green" className="mr-2" />
                                        Duration of Stay:{valueDay}
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faCheck} color="green" className="mr-2" />
                                        Check out: {checkOutday} from 12h00
                                    </li>
                                </ul>
                                <button
                                    onClick={() => handleAdd()}
                                    type="button"
                                    className="py-2 px-3 float-right text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Xác Nhận Thông tin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Booking;
