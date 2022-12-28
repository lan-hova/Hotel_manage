import { Link } from 'react-router-dom';
import config from '~/config';
import { toast } from 'react-toastify';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllBookingByStatus } from '~/app/reducers/booking';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from 'flowbite-react';


function BookingManage() {
    const bookings = useSelector((state) => state.booking.booking);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllBookingByStatus());

    }, []);
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
                            <span className="px-2">Quản lý Booking</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="grid mt-2  rounded-full text-white">


            </div>
            <div className="mt-4 p-2">
                <div className="overflow-x-auto relative">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    CUSTOMER NAME
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    KIND OF ROOM
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    SĐT
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    CITIZEN ID CODE
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    DATE OF HIRE
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    CHECK OUT DAY
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    TIME IN
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    TIME OUT
                                </th>
                                <th scope="col" className="py-3 px-6" colSpan={2}>
                                    ACTION
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((x) =>(
                                <tr key={x.id}>
                                    <td></td>
                                <td className="py-4 px-6 ">{x.name}</td>
                                <td className="py-4 px-6 ">{x.kindOfRoom.name}</td>
                                <td className="py-4 px-6 "> {x.phoneNumber}</td>
                                <td className="py-4 px-6 ">{x.citizenIdCode}</td>
                                <td className="py-4 px-6 ">{x.dateOfHire}</td>
                                <td className="py-4 px-6 ">{x.checkOutDay}</td>
                                <td className="py-4 px-6 ">{x.timeIn}</td>
                                <td className="py-4 px-6 ">{x.timeOut}</td>
                                <td className="py-4 px-6 ">
                                            <button
                                                type="button"
                                                
                                                className="py-2 px-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                            >
                                                <span className="mx-2">SỬA</span>
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 ">
                                            <button
                                                type="button"
                                                
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
            </div>
        </div>
    )
}
export default BookingManage;


