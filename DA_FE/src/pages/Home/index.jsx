import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useState, useEffect } from 'react';
import { Button, Carousel, DatePicker, Divider, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading/loading';
import { toast, ToastContainer } from 'react-toastify';


const contentStyle = {
    height: '380px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

const Home = () => {

    const { idBooking } = useParams();
    const days = [];
    for(let i = 1; i <= 30; i++) {
        days.push({
            label: i + " Ngày",
            value: i,
        })
    }
    const [day, setDay] = useState(days[0].value);
    const dateNow = new Date();
    const dateTomorrow = new Date();
    dateTomorrow.setDate(dateNow.getDate() + 1);
    const [hireDate, setHireDate] = useState(dayjs(dateTomorrow).format('YYYY-MM-DD'));
    const [checkOutDay, setCheckOutDay] = useState();
    const [kindOfRoomList, setKindOfRoomList] = useState();
    const [kindOfRoom, setKindOfRooom] = useState();
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [numberOfKids, setNumberOfKids] = useState(0);
    const [quantityRoom, setQuantityRoom] = useState(1);
    const [openOption, setOpenOption] = useState(false);
    const [timeInOut, setTimeInOut] = useState();
    const navigate = new useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(
        () => {
            setIsLoading(true);
            if(idBooking) {
                checkAndUpdateBanking();
            }
            genCheckOutDay(hireDate, day);
            getAllKindOfRoom();
            getTimeInOut();
            setTimeout(() => {
                setIsLoading(false)
            }, 500);
        }, []
    )

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const checkAndUpdateBanking = async () => {
        
        if(window.location.search && idBooking) {
            let codePayment = new URLSearchParams(window.location.search).get("vnp_ResponseCode");
            if(codePayment == "00") {
                await axios
                    .post("http://localhost:8080/api/booking/update-payment-status/" + idBooking)
                    .then((res) => {
                        if(res) {
                            toast.success('Đặt phòng thành công', { autoClose: 2000 });
                        }
                    })
            } else {
                await axios
                    .delete("http://localhost:8080/api/booking/" + idBooking)
                    .then((res) => {
                        if(res) {
                            toast.error('Thanh toán chưa công', { autoClose: 2000 });
                        }
                    })
            }
        }
    }

    const getTimeInOut = async () => {
        await axios
            .get("http://localhost:8080/api/config-time")
            .then((res) => {
                setTimeInOut(res.data);
            })
    }

    const genCheckOutDay = (valueIn, valueDay) => {
        let dateIn = new Date(valueIn);
        let dateOut = new Date();
        dateOut.setDate(dateIn.getDate() + valueDay);
        setCheckOutDay(dayjs(dateOut).format('YYYY-MM-DD'));
    }

    const formatDateTime = (value) => {
        let date = "";
        if(value) {
            let arrayDate = value.split('-');
            date = arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0];
        }
        return date;
    };

    const getAllKindOfRoom = async () => {
        await axios.get('http://localhost:8080/api/kind-of-room')
                .then(res => {
                    setKindOfRoomList(res.data);
                    setKindOfRooom(res.data[0].id);
                }).catch(err => {});
    }

    const genOptionsKindOfRoom = () => {
        let array = null;
        if(kindOfRoomList) {
            array = kindOfRoomList.map(
                (x) => ({
                    value: x.id, label: x.name
                })
            );
        }
        return array;
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    };

    return (
        <div className='bg-white'>  
            {isLoading && (<Loading content={idBooking ? "Đang check thanh toán!" : ""}></Loading>)}
            <ToastContainer></ToastContainer>
            <div 
                className='w-full'
                // style={{boxShadow: '#1b1b1b 0px 1px 3px 0px'}}
            >
                <Carousel autoplay autoplaySpeed={2000} dotPosition={"top"}>
                    <div className='rounded-lg h-full'>
                        <h3 style={contentStyle}>
                            <img
                                className='w-full h-full rounded-lg'
                                src="https://cdn.pixabay.com/photo/2015/01/05/09/29/grancanaria-589059_960_720.jpg"
                                alt="banner"
                            />
                        </h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>
                            <img
                                className='w-full h-full rounded-lg'
                                src="https://cdn.pixabay.com/photo/2015/10/20/18/57/furniture-998265_960_720.jpg"
                                alt="banner"
                            />
                        </h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>
                            <img
                                className='w-full h-full rounded-lg'
                                src="https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_960_720.jpg"
                                alt="banner"
                            />
                        </h3>
                    </div>
                </Carousel>
            </div>

            <div className='py-5 text-base absolute top-[330px] right-[280px] left-[280px]'>
                <div
                    className='rounded-lg p-6 grid grid-cols-3 gap-12 shadow-lg bg-white'
                    // style={{boxShadow: '#1b1b1b 0px 1px 3px 0px'}}
                >
                    <div>
                        <div className='font-medium'>
                            Nhận phòng:
                        </div>
                        <DatePicker
                            size="large"
                            className="mt-2 w-full"
                            format="DD-MM-YYYY"
                            placeholder="Chọn ngày"
                            disabledDate={disabledDate}
                            value={ hireDate ? dayjs(hireDate) : "" }
                            onChange={
                                (date, dateString) => {
                                    if(dateString) {
                                        setHireDate(formatDateTime(dateString));
                                        genCheckOutDay(formatDateTime(dateString), day);
                                    } else {
                                        setHireDate(dayjs(dateTomorrow));
                                        genCheckOutDay(dayjs(dateTomorrow), day);
                                    }
                                }
                            }
                        />
                    </div>
                    <div>
                        <div className='font-medium'>
                            Số ngày:
                        </div>
                        <Select
                            size='large'
                            className="w-full mt-2"
                            options={days}
                            value={day ? day : days[0].value}
                            onChange={
                                (e) => {
                                    setDay(e);
                                    genCheckOutDay(hireDate, e);
                                }
                            }
                        />
                    </div>
                    <div>
                        <div className='font-medium'>
                            Trả phòng:
                        </div>
                        <DatePicker
                            disabled
                            size="large"
                            className="mt-2 w-full"
                            format="DD-MM-YYYY"
                            placeholder="Chọn ngày"
                            value={ checkOutDay ? dayjs(checkOutDay) : "" }
                        />
                    </div>
                    <div className=''>
                        <div className='font-medium'>
                            Người lớn, trẻ em và số phòng:
                        </div>
                        <div
                            className='mt-2 w-full h-10 border rounded-lg flex items-center pl-3 hover:cursor-pointer hover:border-design-greenLight'
                            onClick={
                                () => setOpenOption(!openOption)
                            }
                        >
                            {numberOfAdults} người lớn, {numberOfKids} trẻ em, {quantityRoom} phòng
                        </div>
                        <div className={`bg-design-lightGray rounded-lg p-3 mt-2 ${openOption ? "" : "hidden"}`}>
                            <div className='flex items-center'>
                                <div className='w-full font-medium'>
                                    Người lớn
                                </div>
                                <div className='w-full ml-3 flex items-center justify-end select-none'>
                                    <div
                                        className='h-10 w-10 bg-white border rounded-lg flex justify-center items-center cursor-pointer hover:bg-default-1 text-design-greenLight'
                                        onClick={
                                            () => {
                                                if(numberOfAdults >= 2) {
                                                    setNumberOfAdults(numberOfAdults - 1)
                                                }
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                                    </div>
                                    <div className='h-10 w-10 bg-white border rounded-lg mx-1 flex justify-center items-center font-semibold text-lg'>
                                        {numberOfAdults}
                                    </div>
                                    <div 
                                        className='h-10 w-10 bg-white border rounded-lg flex justify-center items-center cursor-pointer hover:bg-default-1 text-design-greenLight'
                                        onClick={
                                            () => {
                                                setNumberOfAdults(numberOfAdults + 1)
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center mt-2'>
                                <div className='w-full font-medium'>
                                    Trẻ em
                                </div>
                                <div className='w-full ml-3 flex items-center justify-end select-none'>
                                    <div
                                        className='h-10 w-10 bg-white border rounded-lg flex justify-center items-center cursor-pointer hover:bg-default-1 text-design-greenLight'
                                        onClick={
                                            () => {
                                                if(numberOfKids >= 1) {
                                                    setNumberOfKids(numberOfKids - 1)
                                                }
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                                    </div>
                                    <div className='h-10 w-10 bg-white border rounded-lg mx-1 flex justify-center items-center font-semibold text-lg'>
                                        {numberOfKids}
                                    </div>
                                    <div
                                        className='h-10 w-10 bg-white border rounded-lg flex justify-center items-center cursor-pointer hover:bg-default-1 text-design-greenLight'
                                        onClick={
                                            () => {
                                                setNumberOfKids(numberOfKids + 1)
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center mt-2'>
                                <div className='w-full font-medium'>
                                    Số phòng
                                </div>
                                <div className='w-full ml-3 flex items-center justify-end select-none'>
                                    <div
                                        className='h-10 w-10 bg-white border rounded-lg flex justify-center items-center cursor-pointer hover:bg-default-1 text-design-greenLight'
                                        onClick={
                                            () => {
                                                if(quantityRoom >= 2) {
                                                    setQuantityRoom(quantityRoom - 1)
                                                }
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                                    </div>
                                    <div className='h-10 w-10 bg-white border rounded-lg mx-1 flex justify-center items-center font-semibold text-lg'>
                                        {quantityRoom}
                                    </div>
                                    <div
                                        className='h-10 w-10 bg-white border rounded-lg flex justify-center items-center cursor-pointer hover:bg-default-1 text-design-greenLight'
                                        onClick={
                                            () => {
                                                setQuantityRoom(quantityRoom + 1)
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <div className='font-medium'>
                            Loại phòng:
                            <Select
                                size='large'
                                className="w-full mt-2"
                                options={genOptionsKindOfRoom()}
                                value={kindOfRoom ? kindOfRoom : genOptionsKindOfRoom() ? genOptionsKindOfRoom()[0].value : ""}
                                onChange={
                                    (e) => {
                                        setKindOfRooom(e);
                                    }
                                }
                            />
                        </div>
                    </div>
                    <div className=''>
                        <div className='select-none'>
                            &nbsp;
                        </div>
                        <Button
                            size='large'
                            type='primary'
                            className='mt-2 w-full'
                            onClick={
                                () => navigate("/booking/" + hireDate + "/" + checkOutDay + "/" + kindOfRoom + "/" + numberOfAdults + "/" + numberOfKids + "/" + quantityRoom + "/" + day)
                            }
                        >Lựa chọn</Button>
                    </div>
                    {hireDate && checkOutDay && (
                        <div className='col-span-3 font-medium'>
                            Khách đến nhận phòng vào: &nbsp;
                            <span className='text-red-600 font-semibold'>
                                {timeInOut && timeInOut[0].timeIn} {dayjs(hireDate).format('DD-MM-YYYY')}
                            </span>
                            &nbsp;
                            và trả phòng vào: &nbsp;
                            <span className='text-red-600 font-semibold'>
                                {timeInOut && timeInOut[0].timeOut} {dayjs(checkOutDay).format('DD-MM-YYYY')}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className='py-5 pt-[280px] px-[280px] text-base'>
                <div className='font-bold text-xl'>
                    Các loại phòng
                </div>
                <div className='grid grid-cols-3 gap-12 mt-6'>
                    {kindOfRoomList && kindOfRoomList.map(
                        (x) => {
                            return (
                                <div
                                    className='cursor-pointer hover:bg-default-1'
                                    onClick={
                                        () => navigate("/booking/" + x.id)
                                    }
                                >
                                    <div className=''>
                                        <img src="https://cf.bstatic.com/xdata/images/hotel/square600/286659200.webp?k=9206fc9239b3e4538c22d04b85213d6d5e6257015022de8a37effd956fcde4b6&o=&s=1" alt="" />
                                    </div>
                                    <div className='mt-2'>
                                        <div className='text-lg font-bold'>
                                            {x.name}
                                        </div>
                                        <div className='text-base font-medium'>
                                            Tiện nghi - Thoải mái- Đầy đủ tiện ích
                                        </div>
                                        <div className='text-base font-medium'>
                                            Chỉ từ: &nbsp;
                                            <span className='font-semibold text-red-600'>
                                                {formatCurrency(x.priceByDay)}
                                            </span>
                                        </div>
                                        <div className='mt-2'>
                                            <div className='flex items-center'>
                                                <span className='w-6 h-6 rounded-md bg-design-charcoalblack flex justify-center items-center text-xs text-white'>
                                                    9.0
                                                </span>
                                                <span className='ml-2'>Xuất sắc • 100 Đánh giá</span>
                                            </div>
                                            {/* <div>
                                                <Button className='w-full bg-design-charcoalblack text-white'>Đặt ngay</Button>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>

            <div className='py-5 px-[280px]'>
                <Divider></Divider>
                <div className='grid grid-cols-12'>
                    <div className='col-span-7 pr-10 flex items-center'>
                        <div>
                            <div className='text-lg font-bold'>
                                Đăng ký nơi nghỉ của bạn
                            </div>
                            <div className='text-base font-medium'>
                                Tiếp cận hàng triệu khách hàng tiềm năng và nâng tầm doanh nghiệp của bạn với chúng tôi.
                            </div>
                        </div>
                    </div>
                    <div className='col-span-5'>
                        <img className='rounded-lg' src="https://ik.imagekit.io/tvlk/image/imageResource/2020/01/24/1579840685837-76cf8c0f1f54757df1c8a7a5ec3d0811.jpeg?tr=h-180,q-75,w-448" alt="" />
                    </div>
                </div>
            </div>

            <div className='py-5 px-[280px]'>
                <Divider></Divider>
                <div className='font-bold text-xl w-full flex justify-center items-center'>
                    Tại sao lên sử dụng dịch vụ của chúng tôi?
                </div>
                <div className='grid grid-cols-4 gap-20 mt-10'>
                    <div>
                        <div className='w-full flex justify-center'>
                            <img src="https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407536280-ddcb70cab4907fa78468540ba722d25b.png?tr=h-150,q-75,w-150" alt="" />
                        </div>
                        <div className='text-lg font-bold'>
                            Phương thức thanh toán an toàn và linh hoạt
                        </div>
                        <div className='text-base font-medium'>
                            Giao dịch trực tuyến an toàn với nhiều lựa chọn như thanh toán tại cửa hàng tiện lợi, chuyển khoản ngân hàng, thẻ tín dụng đến Internet Banking. Không tính phí giao dịch. 
                        </div>
                    </div>
                    <div>
                        <div className='w-full flex justify-center'>
                            <img src="https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407541562-61b4438f5439c253d872e70dd7633791.png?tr=h-150,q-75,w-150" alt="" />
                        </div>
                        <div className='text-lg font-bold'>
                            Hỗ trợ khách hàng 24/7
                        </div>
                        <div className='text-base font-medium'>
                            Đội ngũ nhân viên hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn trong từng bước của quá trình đặt phòng
                        </div>
                    </div>
                    <div>
                        <div className='w-full flex justify-center'>
                            <img src="https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407562736-ea624be44aec195feffac615d37ab492.png?tr=h-150,q-75,w-150" alt="" />
                        </div>
                        <div className='text-lg font-bold'>
                            Khách thực, đánh giá thực
                        </div>
                        <div className='text-base font-medium'>
                            Hơn 10.000.000 đánh giá, bình chọn đã được xác thực từ du khách sẽ giúp bạn đưa ra lựa chọn đúng đắn.
                        </div>
                    </div>
                    <div>
                        <div className='w-full flex justify-center'>
                            <img src="https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407528373-a0e2c450b5cfac244d687d6fa8f5dd98.png?tr=h-150,q-75,w-150" alt="" />
                        </div>
                        <div className='text-lg font-bold'>
                            Giá rẻ mỗi ngày với ưu đãi đặc biệt dành riêng cho ứng dụng
                        </div>
                        <div className='text-base font-medium'>
                            Đặt phòng qua ứng dụng để nhận giá tốt nhất với các khuyến mãi tuyệt vời!
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-5 px-[280px]'>
                <Divider></Divider>
                <div className='grid grid-cols-12'>
                    <div className='col-span-4 pr-10 flex items-center'>
                        <div>
                            <div className='text-lg font-bold'>
                                Đối tác thanh toán
                            </div>
                            <div className='text-base font-medium'>
                                Những đối tác thanh toán đáng tin cậy của chúng tôi sẽ giúp cho bạn luôn an tâm thực hiện mọi giao dịch một cách thuận lợi nhất!
                            </div>
                        </div>
                    </div>
                    <div className='col-span-8 grid grid-cols-5 gap-12'>
                        <img className='rounded-lg h-[60x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2021/04/07/1617778862778-43a622292ba164040d7264969df8725d.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[60x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214182554-3d9057e89f3e8013c6b5623a0b3fd72d.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[60x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214295854-530deeeeef4c927cf42574a9c4f18f26.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[60x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214297342-0f18b61b9af8466c550a64863c2f7fc9.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[60x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214302804-b2cfe4878f3d09ee6b42932a00fac1be.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[40x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214099540-8d8fe069f3c5f30b42c6067bb66bf7b5.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[40x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214097094-68a8e4013fffaf9e3eb509ab01c443cd.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[40x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214118270-af8e9adc7a6c728d0df9c6590279dd48.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[40x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214169837-2e167f93c28a31c50929ff25141af9c7.png?tr=q-75,w-88" alt="" />
                        <img className='rounded-lg h-[40x]' src="https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214177572-608f357f64d150269e946dd01dc35f6c.png?tr=q-75,w-88" alt="" />
                    </div>
                </div>
            </div>
            
            <div className='py-5 pb-10 px-[280px]'>
                <Divider></Divider>
                <div className='w-full flex justify-center items-center'>
                    <div className='text-lg font-bold'>
                        Đặt phòng tại POLYTEL ngay để có thể trải nghiệm vô vàn những ưu đãi!
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;
