import { Link } from 'react-router-dom';
import config from '~/config';

import { faBook, faCircleQuestion, faPhone, faTag, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { getCustomerByNameUser } from '~/app/reducers/customer';
import { useDispatch, useSelector } from 'react-redux';

const user = window.localStorage.getItem('user');

function Header() {
    const userLogin = useSelector((state) => state.customer.customer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCustomerByNameUser(user));
    }, []);

    return (
        <div>
            <div className="grid grid-cols-6 space-x-2 px-20 bg-slate-200 pt-3 pb-3">
                <div className="text-center">
                    <FontAwesomeIcon icon={faTag} />
                    <span className="px-3 text-sm">Khuyến mãi</span>
                </div>
                <div className="text-center">
                    <FontAwesomeIcon icon={faPhone} />
                    <span className="px-3 text-sm">Chăm sóc khách hàng</span>
                </div>
                <div className="text-center">
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    <span className="px-3 text-sm">Về chúng tôi</span>
                </div>
                <div className="text-center">
                    <FontAwesomeIcon icon={faBook} />
                    <span className="px-3 text-sm">Hướng dẫn sử dụng</span>
                </div>
                <div className="text-center col-start-5 col-end-7">
                    <FontAwesomeIcon icon={faUser} />
                    {user?.length > 0 ? (
                        <span className="ml-2">Xin chào {userLogin.fullname} !</span>
                    ) : (
                        <div>
                            <span className="px-3 text-sm">
                                <Link to={config.routes.login}>Đăng nhập</Link>
                            </span>
                            <span className="px-3 text-sm text-blue-500 font-bold">
                                <Link to={config.routes.signup}>Đăng ký</Link>
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-6 px-20 pt-1 pb-1 bg-blue-500 text-white">
                <div className="flex justify-center items-center">
                    <span className="font-bold text-2xl">PolyTel</span>
                </div>
                <div className="col-start-2 col-end-7 justify-between items-center w-full md:flex md:w-auto md:order-1">
                    <ul className="flex flex-col p-4 mt-4 text-white md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <Link
                            to={config.routes.home}
                            className="py-2 pr-4 pl-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to={config.routes.home}
                            className="py-2 pr-4 pl-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        >
                            Tìm kiếm phòng
                        </Link>
                        <Link
                            to={config.routes.home}
                            className="py-2 pr-4 pl-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        >
                            Thông tin khách sạn
                        </Link>
                        <Link
                            to={config.routes.home}
                            className="py-2 pr-4 pl-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        >
                            Loại hình thuê
                        </Link>
                        <Link
                            to={config.routes.home}
                            className="py-2 pr-4 pl-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        >
                            Kết nối
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;
