import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { faFileArrowUp, faFileExcel, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { downloadExcel } from 'react-export-table-to-excel';
import * as xlsx from 'xlsx';

import { Button, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllService, getServiceById, update, add, upload } from '~/app/reducers/service';
import { getAllServiceType } from '~/app/reducers/serviceType';

const objService = {
    name: '',
    prices: '',
    note: '',
    status: '',
    serviceType: '',
};

const regexSpace = /^[^\s]+(\s+[^\s]+)*$/;

const header = ['ID', 'Tên dịch vụ', 'Giá', 'Ghi chú', 'Trạng thái'];

const ServiceSchema = Yup.object().shape({
    name: Yup.string()
        .matches(regexSpace, 'Không chỉ để khoảng trắng')
        .required('Dịch vụ không được để trống'),
    prices: Yup.number().required('Giá không được để trống').positive().integer(),
    note: Yup.string()
        .matches(regexSpace, 'Không chỉ để khoảng trắng')
        .required('Ghi chú không được để trống'),
    status: Yup.string(),
    serviceType: Yup.number().nullable(),
});

function Services() {
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [service, setService] = useState(objService);
    const [valueSearch, setValueSearch] = useState('');
    const [excelData, setExcelData] = useState([]);
    const services = useSelector((state) => state.service.services);
    const servic = useSelector((state) => state.service.service);
    const serviceType = useSelector((state) => state.serviceType.serviceTypes);
    const dispatch = useDispatch();
    const tableRef = useRef(null);

    useEffect(() => {
        dispatch(getAllService());
        dispatch(getAllServiceType());
        setService(servic);
        // eslint-disable-next-line
    }, [servic]);

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const itemsPerPage = 5;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = services.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(services.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % services.length;
        setItemOffset(newOffset);
    };

    function openAdd() {
        setVisibleAdd(true);
    }

    function getIdUpdate(id) {
        dispatch(getServiceById(id));
        setVisibleUpdate(true);
    }
    function getIdDelete(id) {
        dispatch(getServiceById(id));
        setVisibleDelete(true);
    }

    function handleDeleteById() {
        setService(service);
        dispatch(update({ ...service, status: '0' }));
        toast.success('Xóa dịch vụ thành công', { autoClose: 2000 });
        setVisibleDelete(false);
    }

    function handleUpdate(data) {
        dispatch(update({ ...data, serviceType: serviceType.filter((sv) => sv.id === Number(data.serviceType))[0] }));
        toast.success('Cập nhật thành công', { autoClose: 2000 });
        setVisibleUpdate(false);
    }

    function handleAdd(data) {
        dispatch(
            add({
                ...data,
                status: 1,
                serviceType: serviceType.filter(
                    (sv) => sv.id === (data.serviceType === undefined ? serviceType[0].id : Number(data.serviceType)),
                )[0],
            }),
        );
        toast.success('Thêm dịch vụ thành công', { autoClose: 2000 });
        setVisibleAdd(false);
    }

    function handleDownloadExcel() {
        downloadExcel({
            fileName: 'service-manage',
            sheet: 'service-manage',
            tablePayload: {
                header,
                // accept two different data structures
                body: services,
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
        console.log(exceljson);
        dispatch(upload(exceljson));
    };

    return (
        <div>
            <div className="grid grid-cols-6">
                <div className="col-start-1 flex justify-center items-center">
                    <p>Tìm kiếm dịch vụ</p>
                </div>
                <div className="col-start-2 col-end-4">
                    <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <input
                            type="search"
                            onChange={(e) => setTimeout(() => setValueSearch(e.target.value), 1000)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                </div>
                <div className="col-start-4 flex justify-center items-center">
                    <button
                        type="button"
                        onClick={() => {
                            openAdd();
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
                                    Tên dịch vụ
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Giá
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Ghi chú
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Trạng thái
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Loại dịch vụ
                                </th>
                                <th scope="col" className="py-3 px-6" colSpan={2}>
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems
                                .filter((x) => x.name.toLowerCase().includes(valueSearch))
                                .map((x) => (
                                    <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                        <td className="py-4 px-6">{x.name}</td>
                                        <td className="py-4 px-6">{x.prices}</td>
                                        <td className="py-4 px-6">{x.note}</td>
                                        <td className="py-4 px-6">{x.status === 1 ? 'Hoạt động' : 'Không tồn tại'}</td>
                                        <td className="py-4 px-6">{x.serviceType.name}</td>
                                        <td className="py-4 px-6">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    getIdUpdate(x.id);
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
                                                    getIdDelete(x.id);
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
                    <Modal show={visibleDelete} size="md" popup={true} onClose={() => setVisibleDelete(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Xác nhận xóa dịch vụ ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleDeleteById();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleDelete(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    {/* Modal update */}
                    <Modal show={visibleUpdate} size="4xl" popup={true} onClose={() => setVisibleUpdate(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    ...service,
                                    name: service.name || '',
                                    prices: service.prices || '',
                                    note: service.note || '',
                                    serviceType: service.serviceType?.id,
                                }}
                                validationSchema={ServiceSchema}
                                onSubmit={(values) => {
                                    handleUpdate(values);
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
                                                    Tên dịch vụ
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
                                            <div>
                                                <label
                                                    htmlFor="prices"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Giá
                                                </label>
                                                <Field
                                                    name="prices"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.prices && touched.prices
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.prices && touched.prices ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.prices}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="serviceType"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Loại dịch vụ
                                                </label>
                                                <Field
                                                    name="serviceType"
                                                    as="select"
                                                    className="
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                >
                                                    {serviceType.map((x) => (
                                                        <option key={x.id} value={x.id}>
                                                            {x.name}
                                                        </option>
                                                    ))}
                                                </Field>
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
                                            <Button color="gray" onClick={() => setVisibleAdd(false)}>
                                                Đóng
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Modal.Body>
                    </Modal>
                    {/* Modal add */}
                    <Modal show={visibleAdd} size="4xl" popup={true} onClose={() => setVisibleAdd(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <Formik
                                initialValues={{ ...objService, serviceType: serviceType[0]?.id }}
                                validationSchema={ServiceSchema}
                                onSubmit={(values) => {
                                    handleAdd(values);
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
                                                    Tên dịch vụ
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
                                            <div>
                                                <label
                                                    htmlFor="prices"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Giá
                                                </label>
                                                <Field
                                                    name="prices"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.prices && touched.prices
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.prices && touched.prices ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.prices}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="serviceType"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Loại dịch vụ
                                                </label>
                                                <Field
                                                    name="serviceType"
                                                    as="select"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.serviceType && touched.serviceType
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                >
                                                    {serviceType.map((x) => (
                                                        <option key={x.id} value={x.id}>
                                                            {x.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                                {errors.serviceType && touched.serviceType ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.serviceType}
                                                    </div>
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
                                            <Button color="gray" onClick={() => setVisibleAdd(false)}>
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

export default Services;
