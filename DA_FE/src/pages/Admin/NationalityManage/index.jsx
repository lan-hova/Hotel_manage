import { Link } from 'react-router-dom';
import config from '~/config';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllNationality, getNationalityById, update, add } from '~/app/reducers/nationality';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const objNationality = {
    name: '',
    note: '',
    status: '',
};

function Nationality() {
    const [visibleDeleteType, setVisibleDeleteType] = useState(false);
    const [visibleUpdateType, setVisibleUpdateType] = useState(false);
    const [visibleAddType, setVisibleAddType] = useState(false);
    const [nationalitys, setNationalitys] = useState(objNationality);
    const [nationalitysAdd, setNationalitysAdd] = useState(objNationality);
    const nationalityss = useSelector((state) => state.nationality.nationalitys);
    const nationalityee = useSelector((state) => state.nationality.nationality);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllNationality());
        // eslint-disable-next-line
        setNationalitys(nationalityee);
    }, [nationalityee]);

    function openAddType() {
        setVisibleAddType(true);
    }

    function getIdDeleteType(id) {
        dispatch(getNationalityById(id));
        setVisibleDeleteType(true);
    }

    function getIdUpdateType(id) {
        dispatch(getNationalityById(id));
        setVisibleUpdateType(true);
    }

    function handleDeleteByIdType() {
        setNationalitysAdd(nationalitys);
        dispatch(update({ ...nationalitys, status: '0' }));
        setVisibleDeleteType(false);
    }

    function handleUpdateType(dataType) {
        setNationalitys(dataType);
        dispatch(update(nationalitys));
        setVisibleUpdateType(false);
    }

    function handleAddType(dataType) {
        setNationalitysAdd(dataType);
        dispatch(add({ ...nationalitysAdd, status: '1' }));
        setVisibleAddType(false);
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
                            <span className="px-2">Quản lý dịch vụ</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="mt-5 p-3">
                <div>
                    <div className="grid grid-cols-6">
                        <div className="col-start-6">
                            <button
                                type="button"
                                onClick={() => {
                                    openAddType();
                                }}
                                className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <span className="mx-2">Thêm</span>
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 p-2">
                        <div className="overflow-x-auto relative">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            ID
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Tên Quốc gia
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Ghi chú
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
                                    {nationalityss.map((x) => (
                                        <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                            <th
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {x.id}
                                            </th>
                                            <td className="py-4 px-6">{x.name}</td>
                                            <td className="py-4 px-6">{x.note}</td>
                                            <td className="py-4 px-6">{x.status}</td>
                                            <td className="py-4 px-6">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        getIdUpdateType(x.id);
                                                    }}
                                                    className="py-2 px-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                >
                                                    <span className="mx-2">Sửa</span>
                                                </button>
                                            </td>
                                            <td className="py-4 px-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        getIdDeleteType(x.id);
                                                    }}
                                                    className="py-2 px-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                >
                                                    <span className="mx-2">Xóa</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Modal delete */}
                            <Modal
                                show={visibleDeleteType}
                                size="md"
                                popup={true}
                                onClose={() => setVisibleDeleteType(false)}
                            >
                                <Modal.Header />
                                <Modal.Body>
                                    <div className="text-center">
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                            Xác nhận xoá Quốc gia này ?
                                        </h3>
                                        <div className="flex justify-center gap-4">
                                            <Button
                                                color="failure"
                                                onClick={() => {
                                                    handleDeleteByIdType();
                                                }}
                                            >
                                                Đồng ý
                                            </Button>
                                            <Button color="gray" onClick={() => setVisibleDeleteType(false)}>
                                                Không, đóng
                                            </Button>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                            {/* Modal update */}
                            <Modal
                                show={visibleUpdateType}
                                size="4xl"
                                popup={true}
                                onClose={() => setVisibleUpdateType(false)}
                            >
                                <Modal.Header />
                                <Modal.Body>
                                    <form>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Tên Quốc gia
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={nationalitys.name || ''}
                                                    onChange={(e) =>
                                                        setNationalitys({ ...nationalitys, name: e.target.value })
                                                    }
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="status"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Trạng thái
                                                </label>
                                                <input
                                                    type="text"
                                                    id="status"
                                                    name="status"
                                                    disabled
                                                    value={nationalitys.status || '' === 1 ? 'Hoạt động' : ''}
                                                    onChange={(e) =>
                                                        setNationalitys({ ...nationalitys, status: e.target.value })
                                                    }
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="col-start-1 col-end-3">
                                                <label
                                                    htmlFor="note"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Ghi chú
                                                </label>
                                                <textarea
                                                    type="text"
                                                    id="note"
                                                    rows={5}
                                                    name="note"
                                                    value={setNationalitys.note || ''}
                                                    onChange={(e) =>
                                                        setNationalitys({ ...nationalitys, note: e.target.value })
                                                    }
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <Button
                                                onClick={() => {
                                                    handleUpdateType(nationalitys);
                                                }}
                                            >
                                                Cập nhật
                                            </Button>
                                            <Button color="gray" onClick={() => setVisibleUpdateType(false)}>
                                                Đóng
                                            </Button>
                                        </div>
                                    </form>
                                </Modal.Body>
                            </Modal>
                            {/* Modal add */}
                            <Modal
                                show={visibleAddType}
                                size="4xl"
                                popup={true}
                                onClose={() => setVisibleAddType(false)}
                            >
                                <Modal.Header />
                                <Modal.Body>
                                    <form>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Tên Quốc gia
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    onChange={(e) =>
                                                        setNationalitysAdd({ ...nationalitysAdd, name: e.target.value })
                                                    }
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="status"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Trạng thái
                                                </label>
                                                <input
                                                    type="text"
                                                    id="status"
                                                    name="status"
                                                    value={'1'}
                                                    disabled
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="col-start-1 col-end-3">
                                                <label
                                                    htmlFor="note"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Ghi chú
                                                </label>
                                                <textarea
                                                    type="text"
                                                    id="note"
                                                    rows={5}
                                                    name="note"
                                                    onChange={(e) =>
                                                        setNationalitysAdd({ ...nationalitysAdd, note: e.target.value })
                                                    }
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <Button
                                                onClick={() => {
                                                    handleAddType(nationalitysAdd);
                                                }}
                                            >
                                                Thêm
                                            </Button>
                                            <Button color="gray" onClick={() => setVisibleAddType(false)}>
                                                Đóng
                                            </Button>
                                        </div>
                                    </form>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Nationality;
