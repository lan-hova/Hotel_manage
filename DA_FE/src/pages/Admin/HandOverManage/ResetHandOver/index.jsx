import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllResetHandOver } from '~/app/reducers/resetHandOver';
import ReactPaginate from 'react-paginate';

const objSearch2 = {
    dateTimeStart: '',
    dateTimeEnd: '',
};

function ResetHandOver() {
    const [obSearh2, setObSearch2] = useState(objSearch2);
    const [valueSearch2, setValueSearch2] = useState('');
    const [resetHandOverss, setResetHandOverss] = useState([]);
    const resetHandOvers = useSelector((state) => state.resetHandOver.resetHandOvers);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllResetHandOver());
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setResetHandOverss(resetHandOvers);
    }, [resetHandOvers]);

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const itemsPerPage = 5;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems2 = resetHandOverss.slice(itemOffset, endOffset);
    const pageCount2 = Math.ceil(resetHandOverss.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick2 = (event) => {
        const newOffset = (event.selected * itemsPerPage) % resetHandOverss.length;
        setItemOffset(newOffset);
    };

    function handleSearchRange2() {
        setResetHandOverss(
            resetHandOvers.filter(
                (x) => x.dateTimeStart >= obSearh2.dateTimeStart && x.dateTimeEnd <= obSearh2.dateTimeEnd,
            ),
        );
    }

    return (
        <div className="text-black px-1 pb-5">
            <div className="p-5">
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-start-1 col-end-5 text-xl">Bộ lọc</div>
                    <div>
                        <div className="relative">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                            <input
                                type="search"
                                onChange={(e) => setTimeout(() => setValueSearch2(e.target.value), 1000)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Tìm kiếm..."
                            />
                        </div>
                    </div>
                    <div className="col-start-2 col-end-5">
                        <span className="mr-3">
                            <span className="mr-2">Từ</span>
                            <input
                                type="datetime-local"
                                value={obSearh2.dateTimeStart || ''}
                                name="dateOfBirth"
                                onChange={(e) => setObSearch2({ ...obSearh2, dateTimeStart: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-80 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <span className="mx-2">đến</span>
                            <input
                                type="datetime-local"
                                value={obSearh2.dateTimeEnd || ''}
                                onChange={(e) => setObSearch2({ ...obSearh2, dateTimeEnd: e.target.value })}
                                name="dateOfBirth"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-80 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </span>
                        <button
                            type="button"
                            onClick={() => handleSearchRange2()}
                            className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <span className="mx-2">Tìm kiếm</span>
                        </button>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="mb-3 text-xl">Danh sách</div>
                    <div className="overflow-x-auto relative">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        ID
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Nhân viên
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Quản lý
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Tổng tiền
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Số tiền reset
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Số dư
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Thời gian giao ca
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {resetHandOverss
                                    .filter((x) => x.personnel.fullname.toLowerCase().includes(valueSearch2))
                                    .map((x) => (
                                        <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                            <td className="py-4 px-6">{x.id}</td>
                                            <td className="py-4 px-6">{x.personnel.fullname}</td>
                                            <td className="py-4 px-6">{x.receiver}</td>
                                            <td className="py-4 px-6">{x.totalMoney.toLocaleString()}đ</td>
                                            <td className="py-4 px-6">{x.handMoney.toLocaleString()}đ</td>
                                            <td className="py-4 px-6">
                                                {(x.totalMoney - x.handMoney).toLocaleString()}đ
                                            </td>
                                            <td className="py-4 px-6">
                                                {x.dateTimeStart} - {x.dateTimeEnd}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">> Next"
                            onPageChange={handlePageClick2}
                            pageRangeDisplayed={5}
                            pageCount={pageCount2}
                            previousLabel="Prev <<"
                            renderOnZeroPageCount={null}
                            containerClassName="pagination"
                            pageLinkClassName="page-num"
                            previousLinkClassName="page-num"
                            nextLinkClassName="page-num"
                            activeLinkClassName="active-num"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetHandOver;
