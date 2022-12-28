import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { faFileExcel, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { downloadExcel } from 'react-export-table-to-excel';

import { add, getAllServiceType, getServiceTypeById, update } from '~/app/reducers/serviceType';

const objServiceType = {
    name: '',
    note: '',
    status: '',
};

const header = ['ID', 'Tên loại dịch vụ', 'Ghi chú', 'Trạng thái'];

const regexSpace = /^[^\s]+(\s+[^\s]+)*$/;

const ServiceTypeSchema = Yup.object().shape({
    name: Yup.string().matches(regexSpace, 'Không chỉ để khoảng trắng').required('Loại dịch vụ không được để trống'),
    note: Yup.string().matches(regexSpace, 'Không chỉ để khoảng trắng').required('Ghi chú không được để trống'),
    status: Yup.string(),
});

function ServiceTypes() {
    const [visibleDeleteType, setVisibleDeleteType] = useState(false);
    const [visibleUpdateType, setVisibleUpdateType] = useState(false);
    const [visibleAddType, setVisibleAddType] = useState(false);
    const [valueSearch2, setValueSearch2] = useState('');
    const [serviceTypes, setServiceTypes] = useState(objServiceType);
    const serviceTypess = useSelector((state) => state.serviceType.serviceTypes);
    const serviceTypee = useSelector((state) => state.serviceType.serviceType);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllServiceType());
        setServiceTypes(serviceTypee);
        // eslint-disable-next-line
    }, [serviceTypee]);

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const itemsPerPage = 5;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems2 = serviceTypess.slice(itemOffset, endOffset);
    const pageCount2 = Math.ceil(serviceTypess.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick2 = (event) => {
        const newOffset = (event.selected * itemsPerPage) % serviceTypess.length;
        setItemOffset(newOffset);
    };

    function handleDownloadExcel2() {
        downloadExcel({
            fileName: 'servicetype-manage',
            sheet: 'servicetype-manage',
            tablePayload: {
                header,
                // accept two different data structures
                body: serviceTypess,
            },
        });
    }

    function openAddType() {
        setVisibleAddType(true);
    }

    function getIdDeleteType(id) {
        dispatch(getServiceTypeById(id));
        setVisibleDeleteType(true);
    }

    function getIdUpdateType(id) {
        dispatch(getServiceTypeById(id));
        setVisibleUpdateType(true);
    }

    function handleDeleteByIdType() {
        setServiceTypes(serviceTypes);
        dispatch(update({ ...serviceTypes, status: '0' }));
        toast.success('Xóa thành công', { autoClose: 2000 });
        setVisibleDeleteType(false);
    }

    function handleUpdateType(dataType) {
        dispatch(update(dataType));
        toast.success('Cập nhật thành công', { autoClose: 2000 });
        setVisibleUpdateType(false);
    }

    function handleAddType(dataType) {
        dispatch(add({ ...dataType, status: '1' }));
        toast.success('Thêm mới thành công', { autoClose: 2000 });
        setVisibleAddType(false);
    }

    return (
        <div>
            <div className="grid grid-cols-6">
                <div className="col-start-1 flex justify-center items-center">
                    <p>Tìm kiếm loại dịch vụ</p>
                </div>
                <div className="col-start-2 col-end-5">
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
                <div className="col-start-5 flex justify-center items-center">
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
                <div>
                    <button
                        className="py-2 px-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onClick={handleDownloadExcel2}
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
                                    Tên loại dịch vụ
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
                            {currentItems2
                                .filter((x) => x.name.toLowerCase().includes(valueSearch2))
                                .map((x) => (
                                    <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                        <td className="py-4 px-6">{x.name}</td>
                                        <td className="py-4 px-6">{x.note}</td>
                                        <td className="py-4 px-6">{x.status === 1 ? 'Hoạt động' : 'Không tồn tại'}</td>
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
                    {/* Modal delete */}
                    <Modal show={visibleDeleteType} size="md" popup={true} onClose={() => setVisibleDeleteType(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Xác nhận loại dịch vụ ?
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
                    <Modal show={visibleUpdateType} size="4xl" popup={true} onClose={() => setVisibleUpdateType(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            {(
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        ...serviceTypes,
                                        name: serviceTypes.name || '',
                                        note: serviceTypes.note || '',
                                    }}
                                    validationSchema={ServiceTypeSchema}
                                    onSubmit={(values) => {
                                        handleUpdateType(values);
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
                                                        Tên loại dịch vụ
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
                                                <div className="col-start-1 col-end-3">
                                                    <label
                                                        htmlFor="note"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                    >
                                                        Ghi chú
                                                    </label>
                                                    <Field
                                                        name="note"
                                                        as="textarea"
                                                        className={`
                                                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                        ${
                                                            errors.note && touched.note
                                                                ? 'border-2 border-rose-600'
                                                                : ''
                                                        } `}
                                                    />
                                                    {errors.note && touched.note ? (
                                                        <div className="text-sm text-red-600 mt-2">{errors.note}</div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="flex justify-center gap-4 mt-6">
                                                <Button type="submit">Cập nhật</Button>
                                                <Button color="gray" onClick={() => setVisibleAddType(false)}>
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
                    <Modal show={visibleAddType} size="4xl" popup={true} onClose={() => setVisibleAddType(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <Formik
                                initialValues={objServiceType}
                                validationSchema={ServiceTypeSchema}
                                onSubmit={(values) => {
                                    handleAddType(values);
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
                                                    Tên loại dịch vụ
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
                                            <div className="col-start-1 col-end-3">
                                                <label
                                                    htmlFor="note"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Ghi chú
                                                </label>
                                                <Field
                                                    name="note"
                                                    as="textarea"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${errors.note && touched.note ? 'border-2 border-rose-600' : ''} `}
                                                />
                                                {errors.note && touched.note ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.note}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <Button type="submit">Thêm</Button>
                                            <Button color="gray" onClick={() => setVisibleAddType(false)}>
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

export default ServiceTypes;
