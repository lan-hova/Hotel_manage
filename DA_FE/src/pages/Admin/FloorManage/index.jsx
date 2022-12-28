import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import config from '~/config';

import authorServices from '~/services/authorServices';
import { downloadExcel } from 'react-export-table-to-excel';
import * as xlsx from 'xlsx';

import {
    faChevronRight,
    faPlus,
    faMagnifyingGlass,
    faFileExcel,
    faFileArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllNumberOfFloors,
    getByIdNumberOfFloors,
    update,
    AddNBF as add,
    upload,
} from '~/app/reducers/numberOfFloor';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const objNumberOfFloor = {
    numberOfFloors: '',
    status: '',
};

const FloorSchema = Yup.object().shape({
    numberOfFloors: Yup.number().required('Số tầng không được để trống'),
    status: Yup.string().nullable(),
});

const header = ['id', 'numberOfFloors', 'status'];

function NumberOfFloors() {
    const [visibleDeleteFloor, setVisibleDeleteFloor] = useState(false);
    const [visibleUpdateFloor, setVisibleUpdateFloor] = useState(false);
    const [visibleAddFloor, setVisibleAddFloor] = useState(false);
    const [valueSearchFloor, setValueSearchFloor] = useState('');
    const [currentUser, setCurrentUser] = useState();
    const [numberOfFloors, setNumberOfFloors] = useState(objNumberOfFloor);
    const numberOfFloorss = useSelector((state) => state.numberOfFloor.numberOfFloors);
    const numberOfFloor = useSelector((state) => state.numberOfFloor.NumberOfFloor);
    const [excelData, setExcelData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllNumberOfFloors());
        setNumberOfFloors(numberOfFloor);
        authorServices.currentUser().then((res) => setCurrentUser(res));
        // eslint-disable-next-line
    }, [numberOfFloor]);

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const itemsPerPage = 5;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = numberOfFloorss.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(numberOfFloorss.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % numberOfFloorss.length;
        setItemOffset(newOffset);
    };

    function openAddFloor() {
        setVisibleAddFloor(true);
    }

    function getIdDeleteFloor(id) {
        dispatch(getByIdNumberOfFloors(id));
        setVisibleDeleteFloor(true);
    }

    function getIdUpdateFloor(id) {
        dispatch(getByIdNumberOfFloors(id));
        setVisibleUpdateFloor(true);
    }

    function handleDeleteByIdFloor() {
        if (currentUser?.users.roles.some((x) => x.name === 'Quản lý')) {
            setNumberOfFloors(numberOfFloors);
            dispatch(update({ ...numberOfFloors, status: '0' }));
            toast.success('Xóa thành công', { autoClose: 2000 });
        } else {
            toast.error('Không có quyền xóa', { autoClose: 2000 });
        }
        setVisibleDeleteFloor(false);
    }

    function handleUpdateFloor(dataFloor) {
        dispatch(update(dataFloor));
        toast.success('Cập nhật thành công', { autoClose: 2000 });
        setVisibleUpdateFloor(false);
    }

    function handleAddFloor(dataFloor) {
        dispatch(add({ ...dataFloor, status: '1' }));
        toast.success('Thêm mới thành công', { autoClose: 2000 });
        setVisibleAddFloor(false);
    }

    function handleDownloadExcel() {
        downloadExcel({
            fileName: 'floor-manage',
            sheet: 'floor-manage',
            tablePayload: {
                header,
                // accept two different data structures
                body: numberOfFloorss,
            },
        });
    }

    const readExcel = async (e) => {
        const file = e.target.files[0];
        const data = await file.arrayBuffer(file);
        const excelfile = xlsx.read(data);
        const excelsheet = excelfile.Sheets[excelfile.SheetNames[0]];
        const exceljson = xlsx.utils.sheet_to_json(excelsheet);
        setExcelData(exceljson);
        dispatch(upload(exceljson));
    };

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
                            <span className="px-2">Quản lý Tầng</span>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="grid grid-cols-6 gap-3 pt-8 px-3">
                <div className="col-start-1 col-end-7">
                    <hr />
                </div>
                <div className="col-start-1 flex justify-center items-center">
                    <p>Tìm kiếm tầng</p>
                </div>
                <div className="col-start-2 col-end-4">
                    <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <input
                            type="text"
                            id="email-address-icon"
                            onChange={(e) => setTimeout(() => setValueSearchFloor(e.target.value), 1000)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                </div>
                <div className="col-start-4 flex justify-center items-center">
                    <button
                        type="button"
                        onClick={() => {
                            openAddFloor();
                        }}
                        className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="mx-2">Thêm</span>
                    </button>
                </div>
                <div>
                    <button
                        className="py-2 px-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onClick={handleDownloadExcel}
                    >
                        <FontAwesomeIcon className="mr-2" icon={faFileExcel} />
                        Export
                    </button>
                </div>
                <div>
                    <label
                        className="upload-btn-wrapper py-2 px-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        htmlFor="upload"
                    >
                        <FontAwesomeIcon className="mr-2" icon={faFileArrowUp} />
                        Import
                    </label>
                    <input
                        type="file"
                        id="upload"
                        hidden
                        className="py-2 px-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onChange={(e) => readExcel(e)}
                    />
                </div>
            </div>
            <div className="mt-4 p-2">
                <div className="overflow-x-auto relative">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    Tầng
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
                            {currentItems
                                .filter((x) => x.numberOfFloors.toString().includes(valueSearchFloor))
                                .sort((a, b) => b.numberOfFloors - a.numberOfFloors)
                                .map((x) => (
                                    <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                        <td className="py-4 px-6">{x.numberOfFloors}</td>
                                        <td className="py-4 px-6">
                                            {x.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    getIdUpdateFloor(x.id);
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
                                                    getIdDeleteFloor(x.id);
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
                    {/* Modal delete */}
                    <Modal
                        show={visibleDeleteFloor}
                        size="md"
                        popup={true}
                        onClose={() => setVisibleDeleteFloor(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Xác nhận xóa ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleDeleteByIdFloor();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleDeleteFloor(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    {/* Modal update */}
                    <Modal
                        show={visibleUpdateFloor}
                        size="2xl"
                        popup={true}
                        onClose={() => setVisibleUpdateFloor(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            {(
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        ...numberOfFloors,
                                        numberOfFloors: numberOfFloors.numberOfFloors || '',
                                    }}
                                    validationSchema={FloorSchema}
                                    onSubmit={(values) => {
                                        handleUpdateFloor(values);
                                    }}
                                >
                                    {({ errors, touched, values }) => (
                                        <Form>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label
                                                        htmlFor="numberOfFloors"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                    >
                                                        Tầng
                                                    </label>
                                                    <Field
                                                        name="numberOfFloors"
                                                        className={`
                                                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                        ${
                                                            errors.numberOfFloors && touched.numberOfFloors
                                                                ? 'border-2 border-rose-600'
                                                                : ''
                                                        } `}
                                                    />
                                                    {errors.numberOfFloors && touched.numberOfFloors ? (
                                                        <div className="text-sm text-red-600 mt-2">
                                                            {errors.numberOfFloors}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="flex justify-center gap-4 mt-6">
                                                <Button type="submit">Cập nhật</Button>
                                                <Button color="gray" onClick={() => setVisibleUpdateFloor(false)}>
                                                    Đóng
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            ) || ''}
                        </Modal.Body>
                    </Modal>
                    {/* Modal add */}
                    <Modal show={visibleAddFloor} size="2xl" popup={true} onClose={() => setVisibleAddFloor(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <Formik
                                initialValues={objNumberOfFloor}
                                validationSchema={FloorSchema}
                                onSubmit={(values) => {
                                    handleAddFloor(values);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <label
                                                    htmlFor="numberOfFloors"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Tầng
                                                </label>
                                                <Field
                                                    name="numberOfFloors"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.numberOfFloors && touched.numberOfFloors
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.numberOfFloors && touched.numberOfFloors ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.numberOfFloors}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <Button type="submit">Thêm</Button>
                                            <Button color="gray" onClick={() => setVisibleAddFloor(false)}>
                                                Đóng
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default NumberOfFloors;
