import { Link } from 'react-router-dom';
import config from '~/config';
import { toast } from 'react-toastify';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllKindOfRoom } from '~/app/reducers/kindOfRoom';
import { getAllNumberOfFloors } from '~/app/reducers/numberOfFloor';
import { getAllFacility } from '~/app/reducers/facilities';
import { Label, FileInput } from 'flowbite-react';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllService } from '~/app/reducers/service';
import { getByRoomId } from '~/app/reducers/facilityDetail';
import { Button, Modal } from 'flowbite-react';
import { getByRoomIdSv } from '~/app/reducers/serviceAvailable';
import { getAllRoom } from '~/app/reducers/room';

import axios from 'axios';

const objRoom = {
    id: '',
    name: '',
    note: '',
    img: '',
    img1: '',
    img2: '',
    img3: '',
    status: '',
    kindOfRoom: {
        id: '',
        name: '',
        note: '',
        priceByDay: '',
        hourlyPrice: '',
        status: '',
    },
    numberOfFloors: {
        id: '',
        numberOfFloors: 0,
        status: '',
    },
};

function CreateRoomManager() {
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visiblecopy1, setvisiblecopy1] = useState(false);
    const [visiblecopy2, setvisiblecopy2] = useState(false);
    const [visibleAdd2, setVisibleAdd2] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [Room, setRoom] = useState(objRoom);
    const [roomAdd, setRoomAdd] = useState(objRoom);
    const rooms = useSelector((state) => state.room.rooms);
    const KindOfRoom = useSelector((state) => state.kindOfRoom.kindOfRoom);
    const NumberOfFloors = useSelector((state) => state.numberOfFloor.numberOfFloors);
    const Facility = useSelector((state) => state.facility.facilities);
    const services = useSelector((state) => state.service.services);
    const [FacilitieDetails, setFacilitieDetails] = useState([]);
    const [ServiceAvailable, setServiceAvailable] = useState([]);
    const [Service, setService] = useState('');
    const [image, setImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [url, setUrl] = useState('');
    const [url1, setUrl1] = useState('');
    const [url2, setUrl2] = useState('');
    const [url3, setUrl3] = useState('');

    const [Err2, setErr2] = useState('');
    const [Err3, setErr3] = useState('');
    const [Err4, setErr4] = useState('');
    const [Err5, setErr5] = useState('');
    const [valueSearch, setValueSearch] = useState('2');
    const [valueSearch1, setValueSearch1] = useState('');
    const ServiceAva = useSelector((state) => state.serviceAvailable.ServiceAvailables);
    const FacilityDetail = useSelector((state) => state.facilityDetail.facilityDetail);

    function handleFormValidation(NameRoom) {
        setErr2('');
        setErr3('');
        setErr4('');
        setErr5('');
        let formIsValid = true;
        if (!NameRoom) {
            formIsValid = false;
            setErr2("Name is required.");
        }
        if (!image) {
            formIsValid = false;
            setErr3("Image is required.");
        }
        if (!image1) {
            formIsValid = false;
            setErr3("Image is required.");
        }
        if (!image2) {
            formIsValid = false;
            setErr3("Image is required.");
        }
        if (!image3) {
            formIsValid = false;
            setErr3("Image is required.");
        }
        if (FacilitieDetails.length === 0) {
            formIsValid = false;
            setErr4("Facilities Details is required.");
        }
        if (ServiceAvailable.length === 0) {
            formIsValid = false;
            setErr5("Service Available is required.");
        }
        return formIsValid;
    }


    function CopyServiceAvailable() {
        setServiceAvailable([]);
        setServiceAvailable(ServiceAva);
    }

    const addServiceAvailable = (id, value, sl, services) => {
        let array = [...ServiceAvailable];
        let i = 0;
        let obj = {
            id: id,
            quantity: sl,
            prices: value,
            status: 1,
            rooms: {
                id: '',
                name: '',
                note: '',
                img: '',
                img1: '',
                img2: '',
                img3: '',
                status: '',
                kindOfRoom: {
                    id: '',
                    name: '',
                    note: '',
                    priceByDay: '',
                    hourlyPrice: '',
                    status: '',
                },
                numberOfFloors: {
                    id: '',
                    numberOfFloors: '',
                    status: '',
                },
            },
            servicess: {
                id: services.id,
                name: services.name,
                prices: services.prices,
                note: services.note,
                status: services.status,
                serviceType: {
                    id: services.serviceType.id,
                    name: services.serviceType.name,
                    note: services.serviceType.note,
                    status: services.serviceType.status,
                },
            },
        };
        if (array.length > 0) {
            array.map((o) => {
                if (o.servicess.id === services.id) {
                    toast.error('Dịch Vụ Đã Tồn Tại!', { autoClose: 2000 });
                    i++;
                }
            });
            if (i === 0) {
                setServiceAvailable(() => [...ServiceAvailable, obj]);
            }

        } else {
            setServiceAvailable(() => [...ServiceAvailable, obj]);
        }
    };

    function getIdselect(id) {
        dispatch(getByRoomId(id));
        dispatch(getByRoomIdSv(id));
    }

    function CopyFacilitieDetails() {
        setFacilitieDetails([]);
        setFacilitieDetails(FacilityDetail);
    }

    const addFacilitieDetails = (id, value) => {
        let array = [...FacilitieDetails];
        let i = 0;
        let obj = {
            id: id,
            status: '',
            facilities: {
                id: value.id,
                name: value.name,
                status: value.status,
            },
            rooms: {
                id: '',
                name: '',
                note: '',
                img: '',
                img1: '',
                img2: '',
                img3: '',
                status: '',
                kindOfRoom: {
                    id: '',
                    name: '',
                    note: '',
                    priceByDay: '',
                    hourlyPrice: '',
                    status: '',
                },
                numberOfFloors: {
                    id: '',
                    numberOfFloors: '',
                    status: '',
                },
            },
        };

        if (array.length > 0) {
            array.map((o) => {
                if (o.id === id) {
                    toast.error('Tiện Ích Đã Tồn Tại!', { autoClose: 2000 });
                    i++;
                }
            });
            if (i === 0) {
                setFacilitieDetails(() => [...FacilitieDetails, obj]);
            }

        } else {
            setFacilitieDetails(() => [...FacilitieDetails, obj]);
        }
    };

    const updateSL = (id1, value) => {
        let array = [...ServiceAvailable];
        array.map((o, i) => {
            if (o.id === id1) {
                array[i] = {
                    id: id1,
                    quantity: value,
                    prices: o.prices,
                    status: o.status,
                    rooms: o.rooms,
                    servicess: o.servicess,
                };
                console.log(array[i]);
            }
        });
        setServiceAvailable([...array]);
    };

    function deleteItem(id) {
        console.log(id);
        setFacilitieDetails(FacilitieDetails.filter((item) => item.id !== id));
    }

    function deleteItem2(id) {
        console.log(id);
        setServiceAvailable(ServiceAvailable.filter((item) => item.id !== id));
    }

    function uploadImage(data2) {
        if (handleFormValidation(data2.name) === false) {

        } else {
            const data = new FormData();
            data.append('file', image);
            data.append('upload_preset', 'datnqlks');
            data.append('cloud_name', 'dbjvfbdix');
            fetch('https://api.cloudinary.com/v1_1/dbjvfbdix/image/upload', {
                method: 'post',
                body: data,
            })
                .then((resp) => resp.json())
                .then((data) => {
                    const data1 = new FormData();
                    data1.append('file', image1);
                    data1.append('upload_preset', 'datnqlks');
                    data1.append('cloud_name', 'dbjvfbdix');
                    fetch('https://api.cloudinary.com/v1_1/dbjvfbdix/image/upload', {
                        method: 'post',
                        body: data1,
                    })
                        .then((resp) => resp.json())
                        .then((data11) => {
                            const data2 = new FormData();
                            data2.append('file', image2);
                            data2.append('upload_preset', 'datnqlks');
                            data2.append('cloud_name', 'dbjvfbdix');
                            fetch('https://api.cloudinary.com/v1_1/dbjvfbdix/image/upload', {
                                method: 'post',
                                body: data2,
                            })
                                .then((resp) => resp.json())
                                .then((data21) => {
                                    const data3 = new FormData();
                                    data3.append('file', image3);
                                    data3.append('upload_preset', 'datnqlks');
                                    data3.append('cloud_name', 'dbjvfbdix');
                                    fetch('https://api.cloudinary.com/v1_1/dbjvfbdix/image/upload', {
                                        method: 'post',
                                        body: data3,
                                    })
                                        .then((resp) => resp.json())
                                        .then((data31) => {
                                            handleAdd(data2,data.url,data11.url,data21.url,data31.url);
                                        })
                                        .catch((err3) => console.log(err3));
                                })
                                .catch((err2) => console.log(err2));
                        })
                        .catch((err1) => console.log(err1));
                })
                .catch((err) => console.log(err));
        }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllRoom());
        dispatch(getAllNumberOfFloors());
        dispatch(getAllKindOfRoom());
        dispatch(getAllFacility());
        dispatch(getAllService());

        setFacilitieDetails(FacilitieDetails);
    }, [FacilitieDetails]);

    const handleAdd = async (data,url,url1,url2,url3) => {
        setRoomAdd(data);
        if (roomAdd.kindOfRoom.id === '') {
            setRoomAdd({ ...roomAdd, kindOfRoom: KindOfRoom[0], img: url, img1: url1, img2: url2, img3: url3, status: 1 });
        } else if (roomAdd.numberOfFloors.id === '') {
            setRoomAdd({ ...roomAdd, numberOfFloors: NumberOfFloors[0], img: url, img1: url1, img2: url2, img3: url3, status: 1 });
        } else if (roomAdd.note === '') {
            setRoomAdd({ ...roomAdd, note: '', img: url, img1: url1, img2: url2, img3: url3, status: 1 });
        } else {
            setRoomAdd({ ...roomAdd, img: url, img1: url1, img2: url2, img3: url3, status: 1 });
        }

        const response = await axios
            .post('http://localhost:8080/api/room/', {
                rooms: roomAdd,
                facilitiesDetailsList: FacilitieDetails,
                serviceAvailableList: ServiceAvailable,
            })
            .then((res) => {
                if (res) {
                    toast.success('Thêm thành công', { autoClose: 2000 });
                }
            })
            .catch((err) => {
                setTimeout(() => { }, 1000);
            })
            .finally(() => { });

        setVisibleAdd(false);
    };

    function getModal() {
        setVisible(true)
    }

    function getModal2() {
        setVisible2(true)
    }

    return (
        <div className="text-black p-3">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link
                            to={config.routes.roomPlan}
                            className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to={config.routes.roomManage}>
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                            Quản lý Chi tiết phòng
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faChevronRight} />
                            <span className="px-2">Thêm một phòng phòng</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div>
                <form className="mx-4 my-4 divide-y-4 divide-slate-400/25">
                    <div className="grid grid-cols-5 gap-4 text-black mb-4">
                        <div className="mt-4">
                            <label className="mb-2 mr-3 text-gray-900 dark:text-gray-300 font-bold">Tên phòng :</label>
                        </div>
                        <div className="col-span-4 mt-4">
                            <input
                                type="text"
                                id="nameRoom"
                                name="nameRoom"
                                onChange={(e) => setRoomAdd({ ...roomAdd, name: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            {Err2 &&
                                <div style={{ color: "red", paddingBottom: 10 }}>{Err2}</div>
                            }
                        </div>
                        <div className="mt-4">
                            <span className="mr-3 mt-4 font-bold">Loại phòng :</span>
                        </div>
                        <div className="col-span-4 mt-4">
                            <select
                                name="KindOfRoom"
                                id="KindOfRoom"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                    const index = e.target.options[e.target.selectedIndex].id;
                                    setRoomAdd({
                                        ...roomAdd,
                                        kindOfRoom: {
                                            id: KindOfRoom[index].id,
                                            name: KindOfRoom[index].name,
                                            note: KindOfRoom[index].note,
                                            priceByDay: KindOfRoom[index].priceByDay,
                                            hourlyPrice: KindOfRoom[index].hourlyPrice,
                                            status: KindOfRoom[index].status,
                                        },
                                    });
                                    setRoom({
                                        ...Room,
                                        kindOfRoom: {
                                            id: KindOfRoom[index].id,
                                            name: KindOfRoom[index].name,
                                            note: KindOfRoom[index].note,
                                            priceByDay: KindOfRoom[index].priceByDay,
                                            hourlyPrice: KindOfRoom[index].hourlyPrice,
                                            status: KindOfRoom[index].status,
                                        },
                                    });
                                }}
                            >
                                {KindOfRoom.map((x, index) => (
                                    <option key={x.id} value={x.name} id={index}>
                                        {x.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4">
                            <span className="mr-3 font-bold">Tầng :</span>
                        </div>
                        <div className="col-span-4 mt-4">
                            <select
                                name="numberOfFloors"
                                id="numberOfFloors"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                    const index = e.target.options[e.target.selectedIndex].id;
                                    setRoomAdd({
                                        ...roomAdd,
                                        numberOfFloors: {
                                            id: NumberOfFloors[index].id,
                                            numberOfFloors: NumberOfFloors[index].name,
                                            status: NumberOfFloors[index].status,
                                        },
                                    });
                                }}
                            >
                                {NumberOfFloors.map((n, index) => (
                                    <option key={n.id} value={n.numberOfFloors} id={index}>
                                        {n.numberOfFloors}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="" className="mb-2 mt-8 mr-6 text-gray-900 dark:text-gray-300 font-bold">
                                Giá theo ngày:
                            </label>
                        </div>
                        <div className="col-span-4 mt-4">
                            <input
                                type="number"
                                id=""
                                defaultValue={Room?.kindOfRoom?.priceByDay || ''}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder=""
                                disabled={true}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="" className="mb-2 mt-8 mr-6 text-gray-900 dark:text-gray-300 font-bold">
                                Giá theo giờ :
                            </label>
                        </div>
                        <div className="col-span-4 mt-4">
                            <input
                                type="number"
                                id=""
                                defaultValue={Room?.kindOfRoom?.hourlyPrice || ''}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder=""
                                disabled={true}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="" className="text-gray-900 dark:text-gray-300 font-bold">
                                Ảnh :
                            </label>
                        </div>
                        <div className="col-span-4 mt-4">
                            <div id="fileUpload">
                                <div className="mb-2 block">
                                    <Label htmlFor="file" value="Upload file" />
                                    {Err3 &&
                                        <div style={{ color: "red", paddingBottom: 10 }}>{Err3}</div>
                                    }
                                </div>
                                <FileInput
                                    id="file"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </div>
                            <div className="mt-4" id="fileUpload">
                                <FileInput
                                    id="file"
                                    onChange={(e) => setImage1(e.target.files[0])}
                                />
                            </div>
                            <div className="mt-4" id="fileUpload">
                                <FileInput
                                    id="file"
                                    onChange={(e) => setImage2(e.target.files[0])}
                                />
                            </div>
                            <div className="mt-4" id="fileUpload">
                                <FileInput
                                    id="file"
                                    onChange={(e) => setImage3(e.target.files[0])}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="" className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold">
                                Ghi Chú :
                            </label>
                        </div>
                        <div className="col-span-4 mt-4">
                            <textarea
                                id="message"
                                rows="4"
                                onChange={(e) => setRoomAdd({ ...roomAdd, note: e.target.value })}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Note..."
                            ></textarea>
                        </div>
                        <div className="mt-4"></div>
                        <div className="col-span-4 mt-4"></div>
                    </div>
                    <div className="text-black">
                        <div className="mt-8">
                            <label htmlFor="" className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold">
                                Tiện Ích :
                            </label>
                            {Err4 &&
                                <div style={{ color: "red", paddingBottom: 10 }}>{Err4}</div>
                            }
                            <div className="grid gap-x-8 gap-y-4 grid-cols-3 items-center pl-3">
                                {FacilitieDetails.map((f) => (
                                    <div
                                        key={f.id}
                                        id="toast-default"
                                        className="flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                                        role="alert"
                                    >
                                        <div className="ml-3 text-sm font-normal">{f.facilities.name}</div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                deleteItem(f.id);
                                            }}
                                            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                            data-dismiss-target="#toast-default"
                                            aria-label="Close"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={() => {
                                    getModal();
                                }}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    ></path>
                                </svg>
                                Add
                            </button>
                        </div>

                        <div className="mt-8">
                            <label htmlFor="" className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold">
                                Dịch Vụ :
                            </label>
                            {Err5 &&
                                <div style={{ color: "red", paddingBottom: 10 }}>{Err5}</div>
                            }
                            <div className="grid gap-x-8 gap-y-4 grid-cols-3 items-center pl-3">
                                {ServiceAvailable.map((s) => (
                                    <div
                                        key={s.id}
                                        id="toast-default"
                                        className="flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                                        role="alert"
                                    >
                                        <input
                                            id="vue-checkbox-list"
                                            type="number"
                                            value={s.quantity}
                                            onChange={(e) => {
                                                updateSL(s.id, e.target.value);
                                            }}
                                            className="w-full h-8 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        />
                                        <label
                                            htmlFor="vue-checkbox-list"
                                            className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            {s.servicess.name}
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => deleteItem2(s.id)}
                                            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                            data-dismiss-target="#toast-default"
                                            aria-label="Close"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={() => {
                                    getModal2();
                                }}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    ></path>
                                </svg>
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="grid justify-items-end grid-cols-3 gap-4 mt-8 ">
                        <div className="col-span-2 mt-4">
                            <div></div>
                        </div>
                        <div className="mb-4 mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    uploadImage(roomAdd);
                                }}
                                className="py-5 px-32 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <span className="mx-2">Thêm</span>
                            </button>
                        </div>
                    </div>
                </form>
                <Modal show={visible} size="md" popup={true} onClose={() => setVisible(false)}>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Chọn Phương thức muốn thêm
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="gray" onClick={() => {
                                    setVisibleAdd(true)
                                    setVisible(false)
                                }}>
                                    Thêm Mới
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setvisiblecopy1(true)
                                    setVisible(false)
                                }}>
                                    Copy tiện ích có sẵn
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={visible2} size="md" popup={true} onClose={() => setVisible2(false)}>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Chọn Phương thức muốn thêm
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="gray" onClick={() => {
                                    setVisibleAdd2(true);
                                    setVisible2(false)
                                }}>
                                    Thêm Mới
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setvisiblecopy2(true)
                                    setVisible2(false)
                                }}>
                                    Copy dịch vụ có sẵn
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={visibleAdd} size="md" popup={false} onClose={() => setVisibleAdd(false)}>
                    <Modal.Header>Tiện Ích</Modal.Header>
                    <Modal.Body>
                        <div className="overflow-x-auto relative shadow-md md:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 md:h-auto">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            NAME
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            STATUS
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Facility.map((fs) => (
                                        <tr
                                            key={fs.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <td
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {fs.name}
                                            </td>
                                            <td className="py-4 px-6 ">
                                                <label
                                                    htmlFor=""
                                                    className="rounded-full dark:text-gpy-2 px-3 text-sm font-medium text-white bg-blue-700"
                                                ></label>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    value={fs}
                                                    type="button"
                                                    onClick={() => {
                                                        addFacilitieDetails(fs.id, fs);
                                                    }}
                                                    className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    <span className="mx-2">Add</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={visibleAdd2} size="xl" popup={false} onClose={() => setVisibleAdd2(false)}>
                    <Modal.Header>Dịch Vụ</Modal.Header>
                    <Modal.Body>
                        <div className="overflow-x-auto relative shadow-md md:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 md:h-auto">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            NAME
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            SERVICE TYPE
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            PRICES
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((s) => (
                                        <tr
                                            key={s.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <td
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {s.name}
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {s.serviceType.name}
                                            </td>
                                            <td
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {s.prices}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    value={s}
                                                    type="button"
                                                    onClick={() => {
                                                        addServiceAvailable(s.id, s.prices, 1, s);
                                                    }}
                                                    className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    <span className="mx-2">Add</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={visiblecopy1} size="6xl" popup={false} onClose={() => setvisiblecopy1(false)}>
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <div className="grid grid-rows-2 grid-flow-col gap-4">
                            <div className="row-span-2 col-span-2">
                                <div className="grid grid-cols-3 gap-3 mt-6 ml-8 text-black">
                                    <div>
                                        <span className="font-bold">Tầng :</span>
                                        <select
                                            name="numberOfFloors"
                                            id="numberOfFloors"
                                            className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(e) =>
                                                setTimeout(
                                                    () =>
                                                        setValueSearch(
                                                            NumberOfFloors[e.target.options[e.target.selectedIndex].id].numberOfFloors,
                                                        ),
                                                    1000,
                                                )
                                            }
                                        >
                                            {NumberOfFloors.map((n, index) => (
                                                <option key={n.id} value={n.numberOfFloors} id={index}>
                                                    {n.numberOfFloors}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <span className="font-bold">Loại phòng :</span>
                                        <select
                                            name="KindOfRoom"
                                            id="KindOfRoom"
                                            className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(e) => {
                                                setTimeout(
                                                    () => setValueSearch1(KindOfRoom[e.target.options[e.target.selectedIndex].id].id),
                                                    1000,
                                                );
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
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="py-3 px-6">
                                                Phòng
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Tầng
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Loại phòng
                                            </th>
                                            <th scope="col" className="py-3 px-6" colSpan={2}>
                                                Hành động
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms
                                            .filter((x) => (x.kindOfRoom.id + '').toLowerCase().includes(valueSearch1))
                                            .filter((x) =>
                                                (x.numberOfFloors.numberOfFloors + '').toLowerCase().includes(valueSearch),
                                            )
                                            .map((x) => (
                                                <tr
                                                    key={x.id}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >

                                                    <th
                                                        scope="row"
                                                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                    >
                                                        {x.name}
                                                    </th>
                                                    <td className="py-4 px-6">{x.numberOfFloors.numberOfFloors}</td>
                                                    <td className="py-4 px-6">{x.kindOfRoom.name}</td>
                                                    <td className="py-4 px-6 ">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                getIdselect(x.id)
                                                            }}
                                                            className="py-2 px-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                        >
                                                            <span className="mx-2">Select</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="row-span-3">
                                <label
                                    htmlFor=""
                                    className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold"
                                >
                                    Tiện Ích :
                                </label>
                                <div className="grid gap-x-8 gap-y-4 grid-cols-3 items-center pl-3">
                                    {FacilityDetail.map((f) => (
                                        <div
                                            key={f.id}
                                            id="toast-default"
                                            className="flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                                            role="alert"
                                        >
                                            <div className="ml-3 text-sm font-normal">
                                                {f.facilities.name || ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => {
                                CopyFacilitieDetails();
                            }}
                            className="py-2 px-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        >
                            Copy
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={visiblecopy2} size="3xl" popup={false} onClose={() => setvisiblecopy2(false)} position="top-center">
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <div className="grid grid-rows-2 grid-flow-col gap-4">
                            <div className="row-span-2 col-span-2">
                                <div className="grid grid-cols-3 gap-3 mt-6 ml-8 text-black">
                                    <div>
                                        <span className="font-bold">Tầng :</span>
                                        <select
                                            name="numberOfFloors"
                                            id="numberOfFloors"
                                            className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(e) =>
                                                setTimeout(
                                                    () =>
                                                        setValueSearch(
                                                            NumberOfFloors[e.target.options[e.target.selectedIndex].id].numberOfFloors,
                                                        ),
                                                    1000,
                                                )
                                            }
                                        >
                                            {NumberOfFloors.map((n, index) => (
                                                <option key={n.id} value={n.numberOfFloors} id={index}>
                                                    {n.numberOfFloors}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <span className="font-bold">Loại phòng :</span>
                                        <select
                                            name="KindOfRoom"
                                            id="KindOfRoom"
                                            className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(e) => {
                                                setTimeout(
                                                    () => setValueSearch1(KindOfRoom[e.target.options[e.target.selectedIndex].id].id),
                                                    1000,
                                                );
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
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="py-3 px-6">
                                                Phòng
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Tầng
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Loại phòng
                                            </th>
                                            <th scope="col" className="py-3 px-6" colSpan={2}>
                                                Hành động
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms
                                            .filter((x) => (x.kindOfRoom.id + '').toLowerCase().includes(valueSearch1))
                                            .filter((x) =>
                                                (x.numberOfFloors.numberOfFloors + '').toLowerCase().includes(valueSearch),
                                            )
                                            .map((x) => (
                                                <tr
                                                    key={x.id}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >

                                                    <th
                                                        scope="row"
                                                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                    >
                                                        {x.name}
                                                    </th>
                                                    <td className="py-4 px-6">{x.numberOfFloors.numberOfFloors}</td>
                                                    <td className="py-4 px-6">{x.kindOfRoom.name}</td>
                                                    <td className="py-4 px-6 ">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                getIdselect(x.id)
                                                            }}
                                                            className="py-2 px-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                        >
                                                            <span className="mx-2">Select</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="row-span-3">
                                <label
                                    htmlFor=""
                                    className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold"
                                >
                                    Dịch Vụ :
                                </label>
                                <div className="grid gap-x-8 gap-y-4 items-center">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 md:h-auto">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="py-3 px-6">
                                                    NAME
                                                </th>
                                                <th scope="col" className="py-3 px-6">
                                                    QUANTITY
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ServiceAva.map((s) => (
                                                <tr
                                                    key={s.id}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                    <td
                                                        scope="row"
                                                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                    >
                                                        {s.servicess.name}
                                                    </td>
                                                    <td
                                                        scope="row"
                                                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                    >
                                                        {s.quantity}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => {
                                CopyServiceAvailable();
                            }}
                            className="py-2 px-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        >
                            Copy
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
export default CreateRoomManager;
