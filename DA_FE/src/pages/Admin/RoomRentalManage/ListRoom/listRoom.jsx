import { CheckOutlined, FontColorsOutlined, ReloadOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, FloatButton, Input, Select } from 'antd';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom } from '@fortawesome/free-solid-svg-icons';
import Floor from './floor';
import axios from 'axios';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

const ListRoom = ({
    optionType, 
    openModalListRoom,
    setOpenModalListRoom,
    hireDate,
    kindOfRoomBooking,
    dataBooking,
    setDataBooking,
    dataBill,
    setDataBill,
    roomBookingList,
    setRoomBookingList,
    extraRoom,
    listRoomChoose,
}) => {

    //Data
    const [roomPlan, setRoomPlan] = useState();
    const [kindOfRoomList, setKindOfRoomList] = useState();
    const [queryFloor,  setQueryFloor] = useState("ALL");
    const [queryKindOfRoom, setQueryKindOfRoom] = useState("ALL");
    const [queryStatus, setQueryStatus] = useState("ALL");
    const [queryName, setQueryName] = useState("");
    const [dateChoose, setDateChoose] = useState(dayjs(hireDate ? new Date(hireDate) : new Date()).format('YYYY-MM-DD'));
    //End Data

    //Created
    useEffect(() => {
        window.scrollTo(0, 0);
        getRoomPlan(dateChoose);
        getAllKindOfRoom();
    }, []);
    useEffect(
        () => {
            setDateChoose(dayjs(hireDate ? new Date(hireDate) : new Date()).format('YYYY-MM-DD'));
            getRoomPlan(hireDate ? hireDate : dayjs(new Date()).format("YYYY-MM-DD"))
        }, [hireDate]
    )
    useEffect(
        () => {
            setQueryFloor("ALL");
            setQueryName("");
            setQueryStatus("ALL");
            setQueryKindOfRoom(kindOfRoomBooking ? kindOfRoomBooking : "ALL");
        }, [kindOfRoomBooking]
    )
    //End Created

    //Gen Data
    const genOptionsFloor = () => {
        const array = [{ value: 'ALL', label: 'ALL' }];
        if(roomPlan) {
            roomPlan.forEach((element) => {
                array.push({ value: element.numberOfFloors, label: 'Tầng ' + element.numberOfFloors });
            });
        }
        return array;
    };
    const genOptionsKindOfRoom = () => {
        const array = [{ value: 'ALL', label: 'ALL' }];
        if(kindOfRoomList) {
            kindOfRoomList.forEach((element) => {
                array.push({ value: element.id, label: element.name });
            });
        }
        return array;
    };
    const filterRoomPlan = () => {
        let filter = null;
        if(roomPlan) {
            filter = roomPlan;
            if (queryFloor !== 'ALL') {
                filter = roomPlan.filter((element) => element.numberOfFloors === queryFloor);
            }
            if (queryStatus !== 'ALL') {
                filter = filter.map((element) => {
                    return {
                        ...element,
                        listRoom: element.listRoom.filter((element2) => element2.rooms.statusByDate === queryStatus),
                    };
                });
            }
            if (queryKindOfRoom !== 'ALL') {
                filter = filter.map((element) => {
                    return {
                        ...element,
                        listRoom: element.listRoom.filter((element2) => element2.rooms.kindOfRoom.id === queryKindOfRoom),
                    };
                });
            }
            if (queryName !== '') {
                filter = filter.map((element) => {
                    return {
                        ...element,
                        listRoom: element.listRoom.filter((element2) =>
                            element2.rooms.name
                                .toLowerCase()
                                .replace(/\s+/g, '')
                                .includes(queryName.toLowerCase().replace(/\s+/g, '')),
                        ),
                    };
                });
            }
        }
        return filter;
    };
    const genQuantityAll = () => {
        let quantity = 0;
        if(roomPlan) {
            roomPlan.forEach((element) => {
                element.listRoom.forEach((element2) => {
                    quantity += 1;
                });
            });
        }
        return quantity;
    };
    const genQuantityByStatus = (status) => {
        let quantity = 0;
        if(roomPlan) {
            roomPlan.forEach((element) => {
                element.listRoom.forEach((element2) => {
                    if (element2.rooms.statusByDate === status) {
                        quantity += 1;
                    }
                });
            });
        }
        return quantity;
    };
    //End Gen Data

    //Function
    const getRoomPlan = async (date) => {
        await axios.get('http://localhost:8080/api/room-rental-manage/get-room-plan/' + date)
                .then(res => {
                    setRoomPlan(res.data);
                }).catch(err => {});
    }
    const getAllKindOfRoom = async () => {
        await axios.get('http://localhost:8080/api/kind-of-room')
                .then(res => {
                    setKindOfRoomList(res.data);
                }).catch(err => {});
    }
    const changeDateChoose = async (date, dateString) => {
        setDateChoose(formatDateTime(dateString));
        await getRoomPlan(formatDateTime(dateString));
    };
    const updateRoomPlan = () => {
        getRoomPlan(dateChoose);
    }
    //End Function

    //Util
    const formatDateTime = (value) => {
        let arrayDate = value.split('-');
        return arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0];
    };
    //End Util

    return (
        <>
            <div className="text-base flex gap-6 mb-6">
                <div className="flex items-center">
                    <div className="mr-2 font-semibold">Tầng: </div>
                    <Select
                        value={queryFloor}
                        style={{
                            width: 120,
                        }}
                        options={genOptionsFloor()}
                        onChange={(value) => {
                            setQueryFloor(value);
                        }}
                    />
                </div>
                <div className="flex items-center">
                    <div className="mr-2 font-semibold">Loại Phòng: </div>
                    <Select
                        value={queryKindOfRoom}
                        style={{ width: 150 }}
                        options={genOptionsKindOfRoom()}
                        onChange={(value) => {
                            setQueryKindOfRoom(value);
                        }}
                        className="font-semibold"
                    />
                </div>
                <div className="flex items-center">
                    <Input
                        value={queryName}
                        onChange={(e) => {
                            setQueryName(e.target.value.toUpperCase());
                        }}
                        className="font-semibold"
                        placeholder="Search..."
                        prefix={<SearchOutlined />}
                    />
                </div>
            </div>
            <div className="mb-6 text-base flex gap-12">
                <div
                    onClick={() => {
                        setQueryStatus('ALL');
                    }}
                    className={`flex items-center cursor-pointer rounded-lg
                    ${queryStatus === 'ALL' ? 'bg-default-2 font-semibold' : 'hover:bg-default-1'}`}
                >
                    <Badge count={genQuantityAll()} showZero>
                        <div className="h-8 w-8 text-white bg-design-charcoalblack flex items-center justify-center rounded-lg">
                            <FontColorsOutlined />
                        </div>
                    </Badge>
                    <div className="mx-4">ALL</div>
                </div>
                <div
                    onClick={() => {
                        setQueryStatus(1);
                    }}
                    className={`flex items-center cursor-pointer rounded-lg
                    ${queryStatus === 1 ? 'bg-default-2 font-semibold' : 'hover:bg-default-1'}`}
                >
                    <Badge count={genQuantityByStatus(1)} showZero>
                        <div className="h-8 w-8 text-white bg-status-1 flex items-center justify-center rounded-lg">
                            <CheckOutlined />
                        </div>
                    </Badge>
                    <div className="mx-4">Phòng trống</div>
                </div>
                <div
                    onClick={() => {
                        setQueryStatus(2);
                    }}
                    className={`flex items-center cursor-pointer rounded-lg
                    ${queryStatus === 2 ? 'bg-default-2 font-semibold' : 'hover:bg-default-1'}`}
                >
                    <Badge count={genQuantityByStatus(2)} showZero>
                        <div className="h-8 w-8 text-white bg-status-2 flex items-center justify-center rounded-lg">
                            <UserOutlined />
                        </div>
                    </Badge>
                    <div className="mx-4">Đã có khách</div>
                </div>
                <div
                    onClick={() => {
                        setQueryStatus(3);
                    }}
                    className={`flex items-center cursor-pointer rounded-lg
                    ${queryStatus === 3 ? 'bg-default-2 font-semibold' : 'hover:bg-default-1'}`}
                >
                    <Badge count={genQuantityByStatus(3)} showZero>
                        <div className="h-8 w-8 text-white bg-status-3 flex items-center justify-center rounded-lg">
                            <FontAwesomeIcon icon={faBroom} className="h-4 w-4"></FontAwesomeIcon>
                        </div>
                    </Badge>
                    <div className="mx-4">Dọn dẹp</div>
                </div>
                <div
                    onClick={() => {
                        // setQueryFloor('ALL');
                        // setQueryKindOfRoom('ALL');
                        // setQueryStatus('ALL');
                        // setQueryName('');
                        getRoomPlan(dateChoose);
                    }}
                    className={`flex items-center cursor-pointer rounded-lg hover:bg-default-1`}
                >
                    <div className="h-8 w-8 text-white bg-default-3 flex items-center justify-center rounded-lg">
                        <ReloadOutlined />
                    </div>
                    <div className="mx-4">Reload</div>
                </div>
            </div>
            <div className='text-base mb-6 font-semibold'>
                Ngày
                <DatePicker
                    disabled
                    className="ml-3"
                    format="DD-MM-YYYY"
                    placeholder="Chọn ngày"
                    value={ dateChoose ? dayjs(dateChoose) : "" }
                    onChange={ (date, dateString) => changeDateChoose(date, dateString) }
                />
            </div>
            {filterRoomPlan() && filterRoomPlan().map((element, index) => {
                return (
                    <Floor
                        key={index}
                        theRoomsOfTheFloor={element}
                        optionType={optionType}
                        setOpenModalListRoom={setOpenModalListRoom}
                        dateChoose={dateChoose}
                        dataBooking={dataBooking}
                        setDataBooking={setDataBooking}
                        dataBill={dataBill}
                        setDataBill={setDataBill}
                        roomBookingList={roomBookingList}
                        setRoomBookingList={setRoomBookingList}
                        updateRoomPlan={updateRoomPlan}
                        extraRoom={extraRoom}
                        listRoomChoose={listRoomChoose}
                    ></Floor>
                );
            })}
        </>
    )
}
export default ListRoom;