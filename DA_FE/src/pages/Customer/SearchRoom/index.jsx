import { Link } from 'react-router-dom';
import config from '~/config';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { faBed, faCalendarDays, faChevronRight, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { seachRoomBooking } from '~/app/reducers/booking'
import { getAllKindOfRoom } from '~/app/reducers/kindOfRoom';
import { getRoomById } from '~/app/reducers/room';
import { getByRoomId} from '~/app/reducers/facilityDetail';

import Header from '~/layouts/Customer/Header';
import Footer from '~/layouts/Customer/Footer';


const date = new Date();
const futureDate = date.getDate() +5;
date.setDate(futureDate);
const defaultValue = date.toLocaleDateString('en-CA');
function SearchRoom() {
    const dispatch = useDispatch();
    const KindOfRoom = useSelector((state) => state.kindOfRoom.kindOfRoom);
    const roomSeach = useSelector((state) => state.booking.roomSeach);
    const [valuedateCheckout, setvaluedateCheckout] = useState('');
    const [valuedateCheckin, setvaluedateCheckin] = useState(defaultValue);
    const [valueSLday, setvalueSLday] = useState('');
    const [valueid, setvalueid] = useState('');

    function getdateCheckout(day) {
        console.log(valuedateCheckin);
        const datecheckout = new Date(valuedateCheckin);
        const futuredatecheckout = datecheckout.getDate() + parseInt(day);
        datecheckout.setDate(futuredatecheckout);
        const valuedateCheckout = datecheckout.toLocaleDateString('en-CA');
        setvaluedateCheckout(valuedateCheckout);
    }

    function CheckSeach() {
        console.log(valueSLday);
        if (valueid.length === 0) {
            dispatch(seachRoomBooking({ v1: valuedateCheckin,v2: valuedateCheckout, v3:KindOfRoom[0].id , v4: valueSLday}));
        } else {
            dispatch(seachRoomBooking({ v1: valuedateCheckin,v2: valuedateCheckout, v3: valueid, v4: valueSLday}));
        }
    }

    function getRoom(id){
        dispatch(getRoomById(id));
        dispatch(getByRoomId(id));
    }

    useEffect(() => {
        dispatch(getAllKindOfRoom());

    }, []);
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
                    </ol>
                </nav>
            </div>
            <div className="grid grid-cols-3 gap-10 mx-36 mt-10">
                <div className="p-6 shadow-md h-fit">
                    <h5 className="font-bold">Tìm kiếm phòng</h5>
                    <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Ngày nhận phòng
                        </label>
                        <div className="relative">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <FontAwesomeIcon icon={faCalendarDays} />
                            </div>
                            <input
                                type="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={valuedateCheckin}
                                onChange={(e) => {
                                    setvaluedateCheckin(e.target.value);
                                    setvalueSLday(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Số ngày thuê
                        </label>
                        <div className="relative">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <FontAwesomeIcon icon={faMoon} />
                            </div>
                            <input
                                type="number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                    getdateCheckout(e.target.value)
                                    setvalueSLday(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Ngày trả phòng
                        </label>
                        <div className="relative">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <FontAwesomeIcon icon={faCalendarDays} />
                            </div>
                            <input
                                type="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={valuedateCheckout}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Loại Phòng
                        </label>
                        <div className="relative">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <FontAwesomeIcon icon={faBed} />
                            </div>
                            <select
                                name="KindOfRoom"
                                id="KindOfRoom"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                    setvalueid(KindOfRoom[e.target.options[e.target.selectedIndex].id].id);

                                }}
                            >
                                {KindOfRoom.map((x, index) => (
                                    <option key={x.id} value={x.name} id={index}>
                                        {x.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => {
                            CheckSeach();
                            // handleAdd(roomAdd, data2, NBFAdd);
                            }}
                            type="button"
                            className="py-2 px-3 w-full text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <span className="mx-2">
                                Tìm kiếm
                            </span>
                        </button>
                    </div>
                </div>
                <div className="col-start-2 col-end-4">
                    <h5 className="font-bold">Tìm thấy {roomSeach.length} phòng phù hợp</h5>
                    {roomSeach.map((x) =>(
                        <div key={x.id} className="grid grid-cols-3 gap-3 mt-8">
                        <Link to={config.routes.room}
                        onClick={() => {
                            getRoom(x.id);
                            
                            }}
                        >
                            <img
                                className="object-cover w-full rounded-lg"
                                src={x.img}
                                alt=""
                            />
                        </Link>
                        <div className="col-start-2 col-end-4 flex flex-col justify-between pl-2 leading-normal">
                            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {x.kindOfRoom.name}
                            </h5>
                            <span className="text-blue-500">Giá phòng : {x.kindOfRoom.priceByDay}</span>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Lối trang trí kiểu cổ điển của Pháp và kiến trúc Châu Âu là nét đặc trưng của Beryl
                                Palace Hotel and Spa, một chỗ nghỉ boutique nằm trên Phố Cổ Hàng Bông nhộn nhịp.
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default SearchRoom;
