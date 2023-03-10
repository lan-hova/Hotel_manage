import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

import { getAllHandOver, update, getHandOverById } from '~/app/reducers/handOver';

const objHandOver = {
    receiver: '',
    dateTimeStart: '',
    dateTimeEnd: '',
    totalMoney: '',
    totalCard: '',
    totalCash: '',
    surcharge: '',
    moneyReal: '',
    moneyHandOver: '',
    moneyFirst: '',
    note: '',
    status: '',
    personnel: {},
};

const objSearch = {
    dateTimeStart: '',
    dateTimeEnd: '',
};

function HandOver() {
    const [visible, setVisible] = useState(false);
    const [visibleConfirm, setVisibleConfirm] = useState(false);
    const [handOver, setHandOver] = useState(objHandOver);
    const [id, setId] = useState('');
    const [valueSearch, setValueSearch] = useState('');
    const [obSearh, setObSearch] = useState(objSearch);
    const handOvers = useSelector((state) => state.handOver.handOvers);
    const hand = useSelector((state) => state.handOver.handOver);
    const [handOverss, setHandOverss] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllHandOver());
        setHandOver(hand);
        // eslint-disable-next-line
    }, [hand]);
    useEffect(() => {
        setHandOverss(handOvers);
    }, [handOvers]);

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const itemsPerPage = 5;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = handOverss.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(handOverss.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % handOverss.length;
        setItemOffset(newOffset);
    };

    function handleSearchRange() {
        setHandOverss(
            handOvers.filter((x) => x.dateTimeStart >= obSearh.dateTimeStart && x.dateTimeEnd <= obSearh.dateTimeEnd),
        );
    }

    function showInfo(id) {
        setId(id);
        dispatch(getHandOverById(id));
        setVisible(true);
    }

    function showConfirm() {
        setVisibleConfirm(true);
    }

    function handleHandOverConfirm() {
        // update money status to 1
        dispatch(update({ ...handOvers.find((x) => x.id === Number(id)), moneyStatus: 1 }));
        toast.success('X??c th???c th??nh c??ng', { autoClose: 2000 });
        setVisibleConfirm(false);
        window.location.reload();
    }

    return (
        <div className="text-black px-1 pb-5">
            <div className="p-5">
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-start-1 col-end-5 text-xl">B??? l???c</div>
                    <div>
                        <div className="relative">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                            <input
                                type="search"
                                onChange={(e) => setTimeout(() => setValueSearch(e.target.value), 1000)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="T??m ki???m..."
                            />
                        </div>
                    </div>
                    <div className="col-start-2 col-end-5">
                        <span className="mr-3">
                            <span className="mr-2">T???</span>
                            <input
                                type="datetime-local"
                                value={obSearh.dateTimeStart || ''}
                                name="dateOfBirth"
                                onChange={(e) => setObSearch({ ...obSearh, dateTimeStart: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-80 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <span className="mx-2">?????n</span>
                            <input
                                type="datetime-local"
                                value={obSearh.dateTimeEnd || ''}
                                onChange={(e) => setObSearch({ ...obSearh, dateTimeEnd: e.target.value })}
                                name="dateOfBirth"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-80 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </span>
                        <button
                            type="button"
                            onClick={() => handleSearchRange()}
                            className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <span className="mx-2">T??m ki???m</span>
                        </button>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="mb-3 text-xl">Danh s??ch</div>
                    <div className="overflow-x-auto relative">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        ID
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Nh??n vi??n giao ca
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Nh??n vi??n nh???n ca
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        S??? ti???n
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Th???i gian giao ca
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        H??nh ?????ng
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems
                                    .filter((x) => x.personnel.fullname.toLowerCase().includes(valueSearch))
                                    .reverse()
                                    .map((x) => (
                                        <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                            <td className="py-4 px-6">{x.id}</td>
                                            <td className="py-4 px-6">{x.personnel.fullname}</td>
                                            <td className="py-4 px-6">{x.receiver}</td>
                                            <td className="py-4 px-6">{x.totalCash.toLocaleString()}??</td>
                                            <td className="py-4 px-6">{x.dateTimeStart}</td>
                                            <td className="py-4 px-6">
                                                <button
                                                    type="button"
                                                    onClick={() => showInfo(x.id)}
                                                    className={`py-2 px-2 text-sm font-medium text-center text-white focus:ring-4 focus:outline-none ${
                                                        x.status === 1
                                                            ? 'bg-green-700 rounded-lg hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                                                            : 'bg-red-700 rounded-lg hover:bg-red-800  focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                                                    }`}
                                                >
                                                    <span className="mx-2">Xem chi ti???t</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">> Next"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="Prev <<"
                            renderOnZeroPageCount={null}
                            containerClassName="pagination"
                            pageLinkClassName="page-num"
                            previousLinkClassName="page-num"
                            nextLinkClassName="page-num"
                            activeLinkClassName="active-num"
                        />
                        {/* Modal show info */}
                        <Modal show={visible} size="6xl" popup={true} onClose={() => setVisible(false)}>
                            <Modal.Header>
                                <p>Th??ng tin chi ti???t</p>
                            </Modal.Header>
                            <hr />
                            <Modal.Body>
                                <div className="mt-3">
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                                        <div>
                                            <span>Nh??n vi??n giao ca : {handOver.personnel?.fullname}</span>
                                        </div>
                                        <div>
                                            <span>Nh??n vi??n nh???n ca : {handOver.receiver}</span>
                                        </div>
                                        <div>
                                            <span>
                                                {handOver.dateTimeStart} - {handOver.dateTimeEnd}
                                            </span>
                                        </div>
                                        <div>
                                            <span>T???ng ti???n : {handOver.totalMoney?.toLocaleString()}??</span>
                                        </div>
                                        <div>
                                            <span>Ti???n ?????u ca : {handOver.moneyFirst?.toLocaleString()}??</span>
                                        </div>
                                        <div>
                                            <span>Ti???n m???t thanh to??n : {handOver.totalCash?.toLocaleString()}??</span>
                                        </div>
                                        <div>
                                            <span>Ti???n th??? : {handOver.totalMoneyCard?.toLocaleString()}??</span>
                                        </div>
                                        <div>
                                            <span>Ph??? thu : {handOver.surcharge?.toLocaleString()}??</span>
                                        </div>
                                        <div>
                                            <span>
                                                Ti???n ???? reset :
                                                {(handOver.totalMoney -
                                                    handOver.totalMoneyCard -
                                                    handOver.totalCash -
                                                    handOver.moneyFirst <
                                                0
                                                    ? 0
                                                    : handOver.totalMoney -
                                                      handOver.totalMoneyCard -
                                                      handOver.totalCash -
                                                      handOver.moneyFirst
                                                ).toLocaleString()}
                                                ??
                                            </span>
                                        </div>
                                        <div>
                                            <span>Th???c nh???n ca tr?????c : {handOver.moneyReal?.toLocaleString()}??</span>
                                        </div>
                                        <div>
                                            <span>
                                                S??? ti???n m???t ???? giao ca : {handOver.moneyHandOver?.toLocaleString()}??
                                            </span>
                                        </div>
                                        <div>
                                            <span
                                                className={`${
                                                    handOver.status === 1
                                                        ? 'text-green-500 font-bold'
                                                        : 'text-red-600 font-bold'
                                                }`}
                                            >
                                                Tr???ng th??i ca : {handOver.status === 1 ? '???? giao ca' : '??ang trong ca'}
                                            </span>
                                        </div>
                                        <div>
                                            <span
                                                className={`${
                                                    handOver.moneyStatus === 0
                                                        ? 'text-green-500 font-bold'
                                                        : 'text-red-600 font-bold'
                                                }`}
                                            >
                                                Tr???ng th??i ti???n :{' '}
                                                {handOver.moneyStatus === 0 ? 'Giao ?????' : 'Ti???n ph??t sinh'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 col-end-4">
                                            <span>Ghi ch?? : </span>
                                            <textarea
                                                type="text"
                                                id="note"
                                                rows={5}
                                                name="note"
                                                disabled
                                                value={handOver.note}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                        </div>
                                        {handOver.status === 1 && handOver.moneyStatus === 0 && (
                                            <div className="flex justify-center items-center">
                                                <button
                                                    onClick={showConfirm}
                                                    className="py-2 px-2 w-full text-sm font-medium text-center text-white focus:ring-4 focus:outline-none bg-green-700 rounded-lg hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                >
                                                    X??c th???c ti???n ph??t sinh
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                        {/* Modal show info */}
                        <Modal show={visibleConfirm} size="2xl" popup={true} onClose={() => setVisibleConfirm(false)}>
                            <Modal.Header>
                                <p>X??c th???c giao ca</p>
                            </Modal.Header>
                            <hr />
                            <Modal.Body>
                                <div className="mt-3">B???n c?? ch???c mu???n x??c th???c ca n??y ?</div>
                                <div className="flex justify-center mt-6 gap-4">
                                    <Button onClick={handleHandOverConfirm}>?????ng ??</Button>
                                    <Button color="gray" onClick={() => setVisibleConfirm(false)}>
                                        Kh??ng, ????ng
                                    </Button>
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
