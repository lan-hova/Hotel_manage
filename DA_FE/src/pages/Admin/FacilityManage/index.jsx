import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import config from '~/config';
import { faChevronRight, faPlus, faMagnifyingGlass, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFacilities, getFacilitiesById, update, add } from '~/app/reducers/facility';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { downloadExcel } from 'react-export-table-to-excel';

const objFacilities = {
    name: '',
    status: '',
};

const header = ['ID', 'Tên cơ sở vật chất', 'Trạng thái'];

const regexSpace = /^[^\s]+(\s+[^\s]+)*$/;

const FacilitySchema = Yup.object().shape({
    name: Yup.string()
        .matches(regexSpace, 'Không chỉ để khoảng trắng')
        .required('Tên cơ sở vật chất không được để trống'),
    status: Yup.string().nullable(),
});

function Facilities() {
    const [visibleDeleteFaci, setVisibleDeleteFaci] = useState(false);
    const [visibleUpdateFaci, setVisibleUpdateFaci] = useState(false);
    const [visibleAddFaci, setVisibleAddFaci] = useState(false);
    const [facilitiex, setFacilitiex] = useState(objFacilities);
    const [valueSearchFaci, setValueSearchFaci] = useState('');
    const facilities = useSelector((state) => state.facilityy.facilities);
    const facility = useSelector((state) => state.facilityy.facility);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllFacilities());
        setFacilitiex(facility);
        // eslint-disable-next-line
    }, [facility]);

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const itemsPerPage = 5;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = facilities.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(facilities.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % facilities.length;
        setItemOffset(newOffset);
    };

    function openAddFaci() {
        setVisibleAddFaci(true);
    }

    function getIdDeleteFaci(id) {
        dispatch(getFacilitiesById(id));
        setVisibleDeleteFaci(true);
    }

    function getIdUpdateFaci(id) {
        dispatch(getFacilitiesById(id));
        setVisibleUpdateFaci(true);
    }

    function handleDeleteByIdFaci() {
        setFacilitiex(facilitiex);
        dispatch(update({ ...facilitiex, status: '0' }));
        toast.success('Xóa thành công', { autoClose: 2000 });
        setVisibleDeleteFaci(false);
    }

    function handleUpdateFaci(dataFaci) {
        dispatch(update(dataFaci));
        toast.success('Cập nhật thành công', { autoClose: 2000 });
        setVisibleUpdateFaci(false);
    }

    function handleAddFaci(dataFaci) {
        dispatch(add({ ...dataFaci, status: '1' }));
        toast.success('Thêm mới thành công', { autoClose: 2000 });
        setVisibleAddFaci(false);
    }

    function handleDownloadExcel() {
        downloadExcel({
            fileName: 'facility-manage',
            sheet: 'facility-manage',
            tablePayload: {
                header,
                // accept two different data structures
                body: facilities,
            },
        });
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
                            <span className="px-2">Quản lý Cơ sở vật chất</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="grid grid-cols-6 gap-3 pt-8 px-3">
                <div className="col-start-1 col-end-7">
                    <hr />
                </div>
                <div className="col-start-1 flex justify-center items-center">
                    <p>Tìm kiếm</p>
                </div>
                <div className="col-start-2 col-end-5">
                    <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <input
                            type="text"
                            id="email-address-icon"
                            onChange={(e) => setTimeout(() => setValueSearchFaci(e.target.value), 1000)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                </div>
                <div className="col-start-5 flex justify-center items-center">
                    <button
                        type="button"
                        onClick={() => {
                            openAddFaci();
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
            </div>
            <div className="mt-4 p-2">
                <div className="overflow-x-auto relative">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    Tên Cơ sở Vật chất
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
                                .filter((x) => x.name.toLowerCase().includes(valueSearchFaci))
                                .map((x) => (
                                    <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                        <td className="py-4 px-6">{x.name}</td>
                                        <td className="py-4 px-6">
                                            {x.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    getIdUpdateFaci(x.id);
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
                                                    getIdDeleteFaci(x.id);
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
                    <Modal show={visibleDeleteFaci} size="md" popup={true} onClose={() => setVisibleDeleteFaci(false)}>
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
                                            handleDeleteByIdFaci();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleDeleteFaci(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    {/* Modal update */}
                    <Modal show={visibleUpdateFaci} size="2xl" popup={true} onClose={() => setVisibleUpdateFaci(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            {(
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        ...facilitiex,
                                        name: facilitiex.name || '',
                                        note: facilitiex.note || '',
                                    }}
                                    validationSchema={FacilitySchema}
                                    onSubmit={(values) => {
                                        handleUpdateFaci(values);
                                    }}
                                >
                                    {({ errors, touched, values }) => (
                                        <Form>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                    >
                                                        Loại hình thuê
                                                    </label>
                                                    <Field
                                                        name="name"
                                                        className={`
                                                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                        ${
                                                            errors.name && touched.name
                                                                ? 'border-2 border-rose-600'
                                                                : ''
                                                        } `}
                                                    />
                                                    {errors.name && touched.name ? (
                                                        <div className="text-sm text-red-600 mt-2">{errors.name}</div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="flex justify-center gap-4 mt-6">
                                                <Button type="submit">Cập nhật</Button>
                                                <Button color="gray" onClick={() => setVisibleUpdateFaci(false)}>
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
                    <Modal show={visibleAddFaci} size="2xl" popup={true} onClose={() => setVisibleAddFaci(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <Formik
                                initialValues={objFacilities}
                                validationSchema={FacilitySchema}
                                onSubmit={(values) => {
                                    handleAddFaci(values);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Tên CS-VC
                                                </label>
                                                <Field
                                                    name="name"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${errors.name && touched.name ? 'border-2 border-rose-600' : ''} `}
                                                />
                                                {errors.name && touched.name ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.name}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <Button type="submit">Thêm</Button>
                                            <Button color="gray" onClick={() => setVisibleAddFaci(false)}>
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

export default Facilities;
