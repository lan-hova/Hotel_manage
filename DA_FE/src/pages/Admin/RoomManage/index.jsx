import { Link } from 'react-router-dom';
import config from '~/config';
import { toast } from 'react-toastify';

import authorServices from '~/services/authorServices';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllRoom, getRoomById } from '~/app/reducers/room';
import { getAllKindOfRoom } from '~/app/reducers/kindOfRoom';
import { getAllNumberOfFloors } from '~/app/reducers/numberOfFloor';
import { getAllFacility } from '~/app/reducers/facilities';
import { UpdateRoom } from '~/app/reducers/room';
import { getByRoomIdSv, UpdateServiceAvailables, addsv } from '~/app/reducers/serviceAvailable';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Label, FileInput } from 'flowbite-react';
import { getByRoomId, fddeleteById, add } from '~/app/reducers/facilityDetail';
import { getAllService } from '~/app/reducers/service';

import axios from 'axios';

const objRoom = {
    id: '',
    name: '',
    note: '',
    img: '',
    img1: '',
    img2: '',
    img3: '',
    status: 0,
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
};

const fdobj = {
    id: '',
    status: '',
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
            prices_by_day: '',
            hourly_prices: '',
            status: '',
        },
        numberOfFloors: {
            id: '',
            numberOfFloors: '',
            status: '',
        },
    },
    facilities: {
        id: '',
        name: '',
        status: '',
    },
};
const objSVA = {
    id: '',
    quantity: '',
    prices: '',
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
        id: '',
        name: '',
        prices: '',
        note: '',
        status: '',
        serviceType: {
            id: '',
            name: '',
            note: '',
            status: '',
        },
    },
};

function RoomManage() {
    const [visible, setVisible] = useState(false);
    const [visibleAdd2, setVisibleAdd2] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [visibleRestore, setVisibleRestore] = useState(false);
    const [Room, setRoom] = useState(objRoom);
    const rooms = useSelector((state) => state.room.rooms);
    const room = useSelector((state) => state.room.room);
    const [currentUser, setCurrentUser] = useState();
    const KindOfRoom = useSelector((state) => state.kindOfRoom.kindOfRoom);
    const NumberOfFloors = useSelector((state) => state.numberOfFloor.numberOfFloors);
    const FacilityDetail = useSelector((state) => state.facilityDetail.facilityDetail);
    const Facility = useSelector((state) => state.facility.facilities);
    const services = useSelector((state) => state.service.services);
    const [FacilitieDetails, setFacilitieDetails] = useState(fdobj);
    const [ServiceAvailable, setServiceAvailable] = useState(objSVA);
    const [ServiceAvailableUpdate, setServiceAvailableUpdate] = useState();
    const [idcheck, setId] = useState(-1);
    const [valueSearch, setValueSearch] = useState('2');
    const [valueSearch1, setValueSearch1] = useState('');
    const [valueSearch2, setValueSearch2] = useState('1');
    const ServiceAva = useSelector((state) => state.serviceAvailable.ServiceAvailables);
    const [image, setImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [Err2, setErr2] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllNumberOfFloors());
        dispatch(getAllKindOfRoom());
        dispatch(getAllRoom());
        dispatch(getAllFacility());
        dispatch(getAllService());
        authorServices.currentUser().then((res) => setCurrentUser(res));
    }, []);

    useEffect(() => {
        setRoom(room);
        setFacilitieDetails(FacilitieDetails);
    }, [room, FacilityDetail]);

    useEffect(() => {
        setValueSearch(valueSearch);
    }, [valueSearch]);

    function handleFormValidation(NameRoom) {
        setErr2('');
        let formIsValid = true;
        if (!NameRoom) {
            formIsValid = false;
            setErr2('Name is required.');
        }
        return formIsValid;
    }

    const addServiceAvailable = (data, sl, pricess) => {
        let i = 0;
        if (ServiceAva.length > 0) {
            ServiceAva.map((o) => {
                if (o.servicess.id === data.id) {
                    toast.error('Dịch Vụ Đã Tồn Tại!', { autoClose: 2000 });
                    i++;
                }
            });
            if (i === 0) {
                dispatch(
                    addsv({
                        ...ServiceAvailable,
                        quantity: sl,
                        prices: pricess,
                        rooms: room,
                        servicess: data,
                        status: 1,
                    }),
                );
            }
        } else {
            dispatch(
                addsv({ ...ServiceAvailable, quantity: sl, prices: pricess, rooms: room, servicess: data, status: 1 }),
            );
        }
        dispatch(getByRoomId(room.id));
    };

    const checkRoom = async (id) => {
        dispatch(getRoomById(id));
        dispatch(getByRoomId(id));
        dispatch(getByRoomIdSv(id));
        setId(id);
        const response = await axios
            .get('http://localhost:8080/api/room/status/' + id)
            .then((res) => {
                toast.error('Phòng đang được sử dụng không được xóa!', { autoClose: 2000 });
            })
            .catch((err) => {
                setVisibleDelete(true);
            })
    };

    const addFacilitieDetails = (data) => {
        let i = 0;
        if (FacilityDetail.length > 0) {
            FacilityDetail.map((o) => {
                if (o.facilities.id === data.id) {
                    toast.error('Dịch Vụ Đã Tồn Tại!', { autoClose: 2000 });
                    i++;
                }
            });
            if (i === 0) {
                dispatch(add({ ...FacilitieDetails, status: 1, rooms: room, facilities: data }));
            }
        } else {
            dispatch(add({ ...FacilitieDetails, status: 1, rooms: room, facilities: data }));
        }
        dispatch(getByRoomId(room.id));
    };

    const updateSV = (id, data) => {
        setServiceAvailableUpdate(data);
        dispatch(UpdateServiceAvailables({ ...ServiceAvailableUpdate, id: id }));
        dispatch(getByRoomId(room.id));
    };

    function getIdUpdate(id) {
        dispatch(getRoomById(id));
        dispatch(getByRoomId(id));
        dispatch(getByRoomIdSv(id));

        setVisibleUpdate(true);
    }

    function getIdDelete(id) {
        checkRoom(id);
    }
    function getIdRestore(id) {
        dispatch(getRoomById(id));
        dispatch(getByRoomId(id));
        dispatch(getByRoomIdSv(id));
        setId(id);
        setVisibleRestore(true);
    }

    function deleteItem(id) {
        dispatch(fddeleteById(id));
        dispatch(getByRoomId(room.id));
    }

    function deleteItem2(id) {
        console.log(id);
        setServiceAvailable(ServiceAvailable.filter((item) => item.id !== id));
        dispatch(getAllRoom());
    }

    function getModal() {
        setVisibleAdd(true);
    }

    function getAll() {
        setValueSearch('')
        setValueSearch1('')
        setValueSearch2('')
        dispatch(getAllRoom());
    }

    function getModal2() {
        setVisibleAdd2(true);
    }
    function uploadImage(data1) {
        if (handleFormValidation(data1.name) === false) {
        } else if (image === '') {
            handleUpdate(data1, room.img);
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
                    console.log(data.url);
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
                            console.log(data11.url);
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
                                    console.log(data21.url);
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
                                            console.log(data21.url);
                                            handleUpdate(data1, data.url, data11.url, data21.url, data31.url);
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

    function handleDeleteById() {
        if (currentUser?.users.roles.some((x) => x.name === 'Quản lý')) {
            dispatch(UpdateRoom({ ...Room, status: 0 }));
            toast.success('Xóa phòng thành công', { autoClose: 2000 });
        } else {
            toast.error('Không có quyền xóa', { autoClose: 2000 });
        }
        setVisibleDelete(false);
    }
    function handleRestore() {
        if (currentUser?.users.roles.some((x) => x.name === 'Quản lý')) {
            dispatch(UpdateRoom({ ...Room, status: 1 }));
            toast.success('Khôi phục phòng thành công', { autoClose: 2000 });
        } else {
            toast.error('Không có quyền khôi phục', { autoClose: 2000 });
        }
        setVisibleRestore(false);
    }

    function handleUpdate(data, url, url1, url2, url3) {
        setRoom(data);
        dispatch(UpdateRoom({ ...Room, img: url, img1: url1, img2: url2, img3: url3 }));
        toast.success('Cập nhật thành công', { autoClose: 2000 });
        setVisibleUpdate(false);
    }



    return (
        <div className="text-black pt-6 px-1 pb-5">
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
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faChevronRight} />
                            <span className="px-2">Quản lý phòng</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="grid mt-2  rounded-full text-white">
                <div className="grid grid-cols-4 gap-4 mt-6 ml-8 text-black">

                    <div className="">
                        <label
                            htmlFor=""
                            className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold"
                        >
                            Hiển thị tất cả
                        </label>
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    getAll()
                                }}
                                className=" mt-3 py-3 px-12 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <span className="mx-2">All</span>
                            </button>
                        </div>

                    </div>

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

                    <div className="grid justify-items-end">
                        <span className="font-bold"></span>
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    setVisible(true);
                                }}
                                className="py-5 px-12 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <span className="mx-2">Thêm</span>
                            </button>
                        </div>
                    </div>

                    <Modal show={visible} size="md" popup={true} onClose={() => setVisible(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Số Phòng Muốn Thêm
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button color="gray">
                                        <Link to={config.routes.createRoomManage}>Thêm 1 Phòng</Link>
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleDelete(false)}>
                                        <Link to={config.routes.createOptionRoomManage}>Thêm Nhiều Phòng</Link>
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
            <div className="mt-4 p-2">
                <div className="overflow-x-auto relative">
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
                                <th scope="col" className="py-3 px-6">
                                    Ảnh
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Giá theo ngày
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Giá theo giờ
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Trạng thái
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
                                .filter((x) =>
                                    (x.status + '').toLowerCase().includes(valueSearch2),
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
                                        <td className="py-4 px-6">
                                            <img
                                                src={x.img}
                                                className="max-w-xl h-auto rounded-sm"
                                                alt="image description"
                                                width={100}
                                            />
                                        </td>
                                        <td className="py-4 px-6">{x.kindOfRoom.priceByDay}</td>
                                        <td className="py-4 px-6">{x.kindOfRoom.hourlyPrice}</td>
                                        <td className="py-4 px-6 ">
                                            <p className="py-4 px-6">
                                                {x.status === 1 ? 'Hoạt động' : 'Không hoạt đông'}
                                            </p>
                                        </td>
                                        {x.status === 1 ? <td className="py-4 px-6 ">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    getIdUpdate(x.id);
                                                }}
                                                className="py-2 px-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                            >
                                                <span className="mx-2">Sửa</span>
                                            </button>
                                        </td> : ''}

                                        <td className="py-4 px-6 ">
                                            {x.status >= 1 ? <button
                                                type="button"
                                                onClick={() => {
                                                    getIdDelete(x.id);
                                                }}
                                                className="py-2 px-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                            >
                                                <span className="mx-2">Xóa</span>
                                            </button> :
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        getIdRestore(x.id);
                                                    }}
                                                    className="py-2 px-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                >
                                                    <span className="mx-2">Khôi phục</span>
                                                </button>}

                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {/* Modal delete */}
                    <Modal show={visibleDelete} size="md" popup={true} onClose={() => setVisibleDelete(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Xác nhận xóa phòng ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleDeleteById();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleDelete(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={visibleRestore} size="md" popup={true} onClose={() => setVisibleRestore(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Xác nhận khôi phục phòng ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleRestore();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleDelete(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* Modal update */}
                    <Modal
                        show={visibleUpdate}
                        size="4xl"
                        position="top-center"
                        popup={true}
                        onClose={() => {
                            setVisibleUpdate(false);
                            setErr2('');
                        }}
                    >
                        <Modal.Header>
                            <p className="mb-2 mr-3 text-gray-900 dark:text-gray-300 font-bold">Update Room</p>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="text-black">
                                    <div>
                                        <label
                                            htmlFor=""
                                            className="mb-2 mr-3 text-gray-900 dark:text-gray-300 font-bold"
                                        >
                                            Tên Phòng :
                                        </label>
                                        <input
                                            type="text"
                                            id="nameRoom"
                                            name="nameRoom"
                                            value={Room.name || ''}
                                            onChange={(e) => setRoom({ ...Room, name: e.target.value })}
                                            className="w-96 p-1 rounded"
                                        />
                                        {Err2 && <div style={{ color: 'red', paddingBottom: 10 }}>{Err2}</div>}
                                    </div>

                                    <div className="grid grid-cols-2 mt-8 text-black">
                                        <div>
                                            <span className="mr-3 font-bold">Loại phòng :</span>
                                            <select
                                                name="KindOfRoom"
                                                id="KindOfRoom"
                                                value={Room?.kindOfRoom?.name || ''}
                                                className="w-40 p-1 rounded"
                                                onChange={(e) => {
                                                    const index = e.target.options[e.target.selectedIndex].id;
                                                    setRoom({
                                                        ...Room,
                                                        kindOfRoom: {
                                                            id: KindOfRoom[index].id,
                                                            roomTypeName: KindOfRoom[index].roomTypeName,
                                                            note: KindOfRoom[index].note,
                                                            priceByDay: KindOfRoom[index].priceByDay,
                                                            hourlyPrice: KindOfRoom[index].hourlyPrice,
                                                            status: KindOfRoom[index].status,
                                                        },
                                                    });
                                                }}
                                            >
                                                {KindOfRoom.map((x, index) => (
                                                    <option key={x.id} value={x.roomTypeName} id={index}>
                                                        {x.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button type="button" className="">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                        <div>
                                            <span className="ml-3 mr-3 font-bold">Tầng :</span>
                                            <select
                                                name="numberOfFloors"
                                                id="numberOfFloors"
                                                className="w-40 p-1 rounded"
                                                value={Room?.numberOfFloors?.numberOfFloors || ''}
                                                onChange={(e) => {
                                                    const index = e.target.options[e.target.selectedIndex].id;
                                                    setRoom({
                                                        ...Room,
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
                                            <button type="button" className="">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 mt-8 text-black">
                                        <div>
                                            <label
                                                htmlFor=""
                                                className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold"
                                            >
                                                Giá Tiền Theo Ngày:
                                            </label>
                                            <input
                                                type="number"
                                                id=""
                                                defaultValue={Room?.kindOfRoom?.priceByDay || ''}
                                                className="w-64 p-1 rounded"
                                                placeholder=""
                                                disabled={true}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor=""
                                                className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold"
                                            >
                                                Giá Tiền Theo Giờ:
                                            </label>
                                            <input
                                                type="number"
                                                id=""
                                                defaultValue={Room?.kindOfRoom?.hourlyPrice || ''}
                                                className="w-64 p-1 rounded"
                                                placeholder=""
                                                disabled={true}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8">
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
                                                    <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                                                        <svg
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                        <span className="sr-only"></span>
                                                    </div>
                                                    <div className="ml-3 text-sm font-normal">
                                                        {f.facilities.name || ''}
                                                    </div>
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
                                        <label
                                            htmlFor=""
                                            className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold"
                                        >
                                            Dịch Vụ :
                                        </label>
                                        <div className="overflow-x-auto relative shadow-md md:rounded-lg">
                                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 md:h-auto">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                    <tr>
                                                        <th scope="col" className="py-3 px-6">
                                                            NAME
                                                        </th>
                                                        <th scope="col" className="py-3 px-6">
                                                            QUANTITY
                                                        </th>
                                                        <th scope="col-2" className="py-3 px-6">
                                                            ACTION
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
                                                                {s.servicess?.name}
                                                            </td>
                                                            <td
                                                                scope="row"
                                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                            >
                                                                <input
                                                                    id="vue-checkbox-list"
                                                                    type="number"
                                                                    defaultValue={s.quantity}
                                                                    onChange={(e) =>
                                                                        setServiceAvailableUpdate({
                                                                            ...ServiceAvailableUpdate,
                                                                            quantity: e.target.value,
                                                                        })
                                                                    }
                                                                    className="w-24 h-8 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                />
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        updateSV(s.id, ServiceAvailableUpdate);
                                                                    }}
                                                                    className="py-2 mx-1 text-sm font-medium text-center text-white bg-violet-400 rounded-lg"
                                                                >
                                                                    <span className="mx-2">Sửa</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { }}
                                                                    className="py-2 px-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                                >
                                                                    <span className="mx-2">Xóa</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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

                                    <div className="mt-8">
                                        <label
                                            htmlFor=""
                                            className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold"
                                        >
                                            Ảnh :
                                        </label>
                                        <div className="col-span-4 mt-4">
                                            <div id="fileUpload">
                                                <div className="mb-2 block">
                                                    <Label htmlFor="file" value="Upload file" />
                                                </div>
                                                <FileInput id="file" onChange={(e) => setImage(e.target.files[0])} />
                                            </div>
                                            <div className="mt-4" id="fileUpload">
                                                <FileInput id="file" onChange={(e) => setImage1(e.target.files[0])} />
                                            </div>
                                            <div className="mt-4" id="fileUpload">
                                                <FileInput id="file" onChange={(e) => setImage2(e.target.files[0])} />
                                            </div>
                                            <div className="mt-4" id="fileUpload">
                                                <FileInput id="file" onChange={(e) => setImage3(e.target.files[0])} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <label
                                            htmlFor=""
                                            className="mb-2 mt-8 mr-9 text-gray-900 dark:text-gray-300 font-bold"
                                        >
                                            Ghi Chú :
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            value={Room.note || ''}
                                            onChange={(e) => setRoom({ ...Room, note: e.target.value })}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Note..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                uploadImage(Room);
                                            }}
                                            className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            <span className="mx-2">Update</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>

                    <Modal show={visibleAdd} size="md" popup={false} onClose={() => setVisibleAdd(false)}>
                        <Modal.Header></Modal.Header>
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
                                                    {fs.status === 1 ? 'Hoạt động' : 'Không tồn tại'}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            addFacilitieDetails(fs);
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

                    <Modal show={visibleAdd2} size="mx" popup={false} onClose={() => setVisibleAdd2(false)}>
                        <Modal.Header></Modal.Header>
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
                                                STATUS
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
                                                <td className="py-4 px-6 ">
                                                    {s.status === 1 ? 'Hoạt động' : 'Không tồn tại'}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            addServiceAvailable(s, 1, s.prices);
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

                    {/* Edit */}
                    {/* <Modal show={visibleDelete} size="md" popup={true} onClose={() => setVisibleDelete(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Xác nhận xóa nhân viên ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleDeleteById(room);
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleDelete(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal> */}
                </div>
            </div>
        </div>
    );
}
export default RoomManage;
