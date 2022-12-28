import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';

import { faCircleCheck, faClock } from '@fortawesome/free-regular-svg-icons';
import { faChevronRight, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'flowbite-react';

import { toast } from 'react-toastify';
import authorServices from '~/services/authorServices';

import bcrypt from 'bcryptjs';

import { getAllPersonnel } from '~/app/reducers/personnel';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHandOverBill } from '~/app/reducers/handOverBill';
import { add, getAllHandOver, update } from '~/app/reducers/handOver';
import { getAllResetHandOver, add as addReset } from '~/app/reducers/resetHandOver';
import { getAllHistory, update as updateHistory } from '~/app/reducers/history';

const objHandOver = {
    receiver: '',
    dateTimeStart: '',
    dateTimeEnd: '',
    totalMoney: '',
    totalCash: '',
    totalMoneyCard: '',
    surcharge: '',
    moneyHandOver: '',
    moneyReal: '',
    moneyFirst: '',
    note: '',
    moneyStatus: '',
    status: '',
    personnel: {},
};

const objResetHandOver = {
    receiver: '',
    dateTimeStart: '',
    dateTimeEnd: '',
    totalMoney: '',
    handMoney: '',
    note: '',
    moneyStatus: '',
    status: 1,
    personnel: {},
};

function HandOver() {
    const [visibleReset, setVisibleReset] = useState(false);
    const [visibleConfirm, setVisibleConfirm] = useState(false);
    const [visibleConfirmReset, setVisibleConfirmReset] = useState(false);
    const [now, setNow] = useState('');
    const [isCheckNote, setIsCheckNote] = useState(false);
    const [passwordReset, setPasswordReset] = useState('');
    const [handOver, setHandOver] = useState(objHandOver);
    const [resetHandOver, setResetHandOver] = useState(objResetHandOver);
    const [currentUser, setCurrentUser] = useState();
    const personnels = useSelector((state) => state.personnel.personnels);
    const handOvers = useSelector((state) => state.handOver.handOvers);
    const histories = useSelector((state) => state.history.histories);
    const { totalCash, totalCard, totalDeposits } = useSelector((state) => state.handOverBill);
    const { resetMoneyFromUserLogin } = useSelector((state) => state.resetHandOver);
    const dispatch = useDispatch();
    const navigate = new useNavigate();
    const userLogin = handOvers
        .filter((x) => x.status === 0)
        .reduce((prev, current) => (prev.dateTimeStart > current.dateTimeStart ? prev : current), {});
    const refNote = useRef(null);

    useEffect(() => {
        dispatch(getAllPersonnel());
        dispatch(getAllHandOver());
        dispatch(getAllHandOverBill());
        dispatch(getAllResetHandOver());
        dispatch(getAllHistory());
        authorServices.currentUser().then((res) => setCurrentUser(res));
        setNow(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19));
        // eslint-disable-next-line
    }, []);

    function showReset() {
        setVisibleReset(true);
    }

    function showConfirm() {
        setVisibleConfirm(true);
    }

    function showConfirmReset() {
        setVisibleConfirmReset(true);
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = '' + d.getFullYear(),
            hours = '' + d.getHours(),
            minutes = '' + d.getMinutes();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;

        return [year, month, day].join('-') + ' ' + hours + ':' + minutes;
    }

    function handleDispatch() {
        const receiverDefault = personnels.filter(
            (x) =>
                x.users.username !== currentUser?.users.username &&
                x.users.roles.some((i) => i.name.includes('Nhân viên')),
        )[0];
        dispatch(
            update({
                ...userLogin,
                dateTimeEnd: formatDate(now),
                moneyHandOver: totalDeposits - handOver.surcharge + userLogin.moneyFirst - resetMoneyFromUserLogin,
                moneyReal: handOver.moneyReal,
                surcharge: handOver.surcharge,
                totalCash: userLogin.totalCash + totalDeposits,
                totalMoneyCard: totalCard,
                totalMoney: totalCard + totalCash,
                note: `${handOver.note.length === 0 ? '' : handOver.note + '.'}`,
                receiver: handOver.receiver === '' ? receiverDefault.users.username : handOver.receiver,
                moneyStatus: handOver.surcharge === 0 ? 0 : 1,
                status: 1,
            }),
        );

        dispatch(
            add({
                ...objHandOver,
                totalCash: userLogin.totalCash + totalDeposits,
                totalMoneyCard: totalCard,
                totalMoney: totalCard + totalCash,
                dateTimeStart: formatDate(now),
                dateTimeEnd: formatDate(now),
                personnel: personnels.filter(
                    (x) =>
                        x.users.username ===
                        (handOver.receiver === '' ? receiverDefault.users.username : handOver.receiver),
                )[0],
                surcharge: 0,
                moneyReal: 0,
                moneyHandOver: 0,
                note: `Đã nhận ca từ nhân viên ${currentUser.fullname} lúc ${formatDate(now)}`,
                moneyFirst: 500000,
                moneyStatus: 0,
                status: 0,
            }),
        );

        dispatch(updateHistory({ ...histories[histories.length - 1], status: 1, handOverStatus: 1 }));
    }

    function handleHandOver() {
        if (handOver.receiver === '') {
            // check note if surcharge have
            if (Number(handOver.surcharge) > 0 && refNote.current.value.length === 0) {
                setIsCheckNote(true);
                toast.error('Vui lòng ghi chú phụ thu', { autoClose: 2000 });
            } else {
                refNote.current.style.borderColor = 'rgb(209 213 219)';
                handleDispatch();
                navigate('/admin/login');
                toast.success('Giao ca thành công', { autoClose: 2000 });
            }
        } else {
            // check note if surcharge have
            if (Number(handOver.surcharge) > 0 && refNote.current.value.length === 0) {
                setIsCheckNote(true);
                toast.error('Vui lòng ghi chú phụ thu', { autoClose: 2000 });
            } else {
                refNote.current.style.borderColor = 'rgb(209 213 219)';
                handleDispatch();
                navigate('/admin/login');
                toast.success('Giao ca thành công', { autoClose: 2000 });
            }
        }
        setVisibleConfirm(false);
    }

    function handleResetHandOver() {
        // check password receiver
        const receiverDefault = personnels.filter(
            (x) =>
                x.users.username !== currentUser.users.username &&
                x.users.roles.some((i) => i.name.includes('Quản lý')),
        )[0];
        if (resetHandOver.receiver === '') {
            bcrypt.compare(passwordReset, receiverDefault.users.password, function (err, isMatch) {
                if (err) {
                    throw err;
                } else if (!isMatch) {
                    toast.error('Mật khẩu xác nhận sai', { autoClose: 2000 });
                } else {
                    if (userLogin.moneyFirst + totalDeposits - resetMoneyFromUserLogin > resetHandOver.handMoney) {
                        dispatch(
                            addReset({
                                ...resetHandOver,
                                receiver: receiverDefault,
                                totalMoney: userLogin.moneyFirst + totalDeposits,
                                dateTimeStart: userLogin.dateTimeStart,
                                dateTimeEnd: formatDate(now),
                                personnel: currentUser,
                            }),
                        );
                        toast.success('Reset ca thành công', { autoClose: 2000 });
                        setVisibleReset(false);
                    } else {
                        toast.error('Số tiền không hợp lệ', { autoClose: 2000 });
                    }
                }
            });
        } else {
            bcrypt.compare(passwordReset, receiverDefault.users.password, function (err, isMatch) {
                if (err) {
                    throw err;
                } else if (!isMatch) {
                    toast.error('Mật khẩu xác nhận sai', { autoClose: 2000 });
                } else {
                    dispatch(
                        addReset({
                            ...resetHandOver,
                            receiver: receiverDefault,
                            totalMoney: userLogin.moneyFirst + totalDeposits,
                            dateTimeStart: userLogin.dateTimeStart,
                            dateTimeEnd: formatDate(now),
                            personnel: currentUser,
                        }),
                    );
                    toast.success('Reset ca thành công', { autoClose: 2000 });
                    setVisibleReset(false);
                }
            });
            //
        }
        setVisibleConfirmReset(false);
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
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faChevronRight} />
                            <span className="px-2">Giao ca</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="mt-4 p-5">
                <div>
                    <hr />
                    <h3 className="font-bold text-blue-500">Thông tin nhân viên giao ca</h3>
                </div>
                <div className="grid grid-cols-3 mt-6 gap-6">
                    <div>
                        <span>Tên nhân viên : {currentUser?.fullname}</span>
                    </div>
                    <div className="col-start-2 col-end-4">
                        <span className="bg-blue-100 text-blue-800 font-medium inline-flex items-center px-2 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                            {histories[0]?.timeIn} đến {formatDate(now)}
                        </span>
                    </div>
                    <div>
                        <span>
                            Tổng tiền trong ca : {(totalCard + totalCash + userLogin.moneyFirst).toLocaleString()}đ
                        </span>
                    </div>
                    <div>
                        <span>Tiền đầu ca : {userLogin.moneyFirst?.toLocaleString()}đ</span>
                    </div>
                    <div>
                        <span>Tiền phòng trả trước (tiền mặt) : {totalDeposits.toLocaleString()}đ</span>
                    </div>
                    <div>
                        <span>Tiền thẻ & chuyển khoản : {totalCard.toLocaleString()}đ</span>
                    </div>
                    <div>
                        <span>Tiền mặt : {totalCash.toLocaleString()}đ</span>
                    </div>
                    <div>
                        <span>Tiền đã reset : {resetMoneyFromUserLogin.toLocaleString()}đ </span>
                    </div>
                    <div>
                        <label
                            htmlFor="fullname"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            Tiền phát sinh (VNĐ)
                        </label>
                        <input
                            type="number"
                            onChange={(e) => setHandOver({ ...handOver, surcharge: Number(e.target.value) })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="col-start-2 col-end-4">
                        <label
                            htmlFor="note"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            Ghi chú (nếu có) <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            type="text"
                            id="note"
                            name="note"
                            rows={4}
                            ref={refNote}
                            onChange={(e) => {
                                setHandOver({ ...handOver, note: e.target.value });
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        {isCheckNote ? (
                            <div className="text-sm text-red-600 mt-2">Vui lòng thêm ghi chú phụ thu</div>
                        ) : null}
                    </div>
                </div>
                <div className="mt-6">
                    <hr />
                    <h3 className="font-bold text-blue-500">Thông tin nhân viên nhận ca</h3>
                    <div className="grid grid-cols-3 mt-6 gap-6">
                        <div>
                            <span>Nhân viên</span>
                            <select
                                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                    const index = e.target.options[e.target.selectedIndex].id;
                                    setHandOver({
                                        ...handOver,
                                        receiver: personnels.filter(
                                            (x) =>
                                                x.users.username !== userLogin.personnel?.users.username &&
                                                x.users.roles.some((i) => i.name.includes('Nhân viên')),
                                        )[Number(index)]?.users.username,
                                    });
                                }}
                            >
                                {personnels
                                    .filter(
                                        (x) =>
                                            x.users.username !== userLogin.personnel?.users.username &&
                                            x.users.roles.some((i) => i.name.includes('Nhân viên')),
                                    )
                                    .map((x, index) => (
                                        <option value={x.users.username} key={x.id} id={index}>
                                            {x.users.username} - {x.fullname}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <span>
                                Tiền mặt giao ca :
                                {(totalDeposits - handOver.surcharge + userLogin.moneyFirst - resetMoneyFromUserLogin >=
                                0
                                    ? totalDeposits -
                                      handOver.surcharge +
                                      userLogin.moneyFirst -
                                      resetMoneyFromUserLogin
                                    : 0
                                ).toLocaleString()}
                                đ
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 mt-10 gap-6">
                    <div>
                        <button
                            type="button"
                            onClick={() => showConfirm()}
                            className="py-2 px-3 w-full text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <FontAwesomeIcon icon={faHandshake} />
                            <span className="mx-2">Giao ca</span>
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => showReset()}
                            className="py-2 px-3 w-full text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        >
                            <FontAwesomeIcon icon={faCircleCheck} />
                            <span className="mx-2">Reset ca</span>
                        </button>
                        {/* Modal reset */}
                        <Modal show={visibleReset} size="5xl" popup={true} onClose={() => setVisibleReset(false)}>
                            <Modal.Header>
                                <p>Xác nhận reset ca</p>
                            </Modal.Header>
                            <hr />
                            <Modal.Body>
                                <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-3">
                                    <div>
                                        <span>Quản lý</span>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(e) => {
                                                const index = e.target.options[e.target.selectedIndex].id;
                                                setResetHandOver({
                                                    ...resetHandOver,
                                                    receiver: personnels.filter(
                                                        (x) =>
                                                            x.users.username !== userLogin.personnel?.users.username &&
                                                            x.users.roles.some((i) => i.name.includes('Quản lý')),
                                                    )[Number(index)]?.users.username,
                                                });
                                            }}
                                        >
                                            {personnels
                                                .filter(
                                                    (x) =>
                                                        x.users.username !== currentUser?.users.username &&
                                                        x.users.roles.some((i) => i.name.includes('Quản lý')),
                                                )
                                                .map((x, index) => (
                                                    <option value={x.users.username} key={x.id} id={index}>
                                                        {x.users.username} - {x.fullname}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Mật khẩu xác nhận <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            onChange={(e) => setPasswordReset(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <span className="bg-blue-100 text-blue-800 font-medium inline-flex items-center px-2 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                                            {histories[0]?.timeIn} đến {formatDate(now)}
                                        </span>
                                    </div>
                                    <div>
                                        <span>
                                            Tổng tiền :{' '}
                                            {(
                                                userLogin.moneyFirst +
                                                totalDeposits -
                                                resetMoneyFromUserLogin
                                            ).toLocaleString()}
                                            đ
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Số tiền reset (VNĐ)
                                        </label>
                                        <input
                                            onChange={(e) =>
                                                setResetHandOver({
                                                    ...resetHandOver,
                                                    handMoney: Number(e.target.value),
                                                })
                                            }
                                            type="number"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <span>
                                            Số dư :
                                            <span className="ml-1">
                                                {(
                                                    userLogin.moneyFirst +
                                                    totalDeposits -
                                                    resetHandOver.handMoney -
                                                    resetMoneyFromUserLogin
                                                ).toLocaleString()}
                                                đ
                                            </span>
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Ghi chú
                                        </label>
                                        <textarea
                                            onChange={(e) =>
                                                setResetHandOver({ ...resetHandOver, note: e.target.value })
                                            }
                                            type="text"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center mt-6 gap-4">
                                    <Button onClick={() => showConfirmReset()}>Xác nhận</Button>
                                    <Button color="gray" onClick={() => setVisibleReset(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                        {/* Modal confirm hand over */}
                        <Modal show={visibleConfirm} size="md" popup={true} onClose={() => setVisibleConfirm(false)}>
                            <Modal.Header />
                            <Modal.Body>
                                <div className="text-center">
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        Bạn có muốn giao ca ?
                                    </h3>
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            color="failure"
                                            onClick={() => {
                                                handleHandOver();
                                            }}
                                        >
                                            Đồng ý
                                        </Button>
                                        <Button color="gray" onClick={() => setVisibleConfirm(false)}>
                                            Không, đóng
                                        </Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                        {/* Modal confirm reset hand over */}
                        <Modal
                            show={visibleConfirmReset}
                            size="md"
                            popup={true}
                            onClose={() => setVisibleConfirmReset(false)}
                        >
                            <Modal.Header />
                            <Modal.Body>
                                <div className="text-center">
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        Bạn có muốn reset ca ?
                                    </h3>
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            color="failure"
                                            onClick={() => {
                                                handleResetHandOver();
                                            }}
                                        >
                                            Đồng ý
                                        </Button>
                                        <Button color="gray" onClick={() => setVisibleConfirmReset(false)}>
                                            Không, đóng
                                        </Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HandOver;
