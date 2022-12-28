import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { Link } from 'react-router-dom';
import config from '~/config';

import {
    faChevronRight,
    faFileExcel,
    faMagnifyingGlass,
    faPlus,
    faSackDollar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { downloadExcel } from 'react-export-table-to-excel';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update as updateHandOver } from '~/app/reducers/handOver';
import { add, getAllNationality, getAllPersonnel, getPersonnelById, update } from '~/app/reducers/personnel';

import { Button, Modal } from 'flowbite-react';
import { getAllHandOver } from '~/app/reducers/handOver';

const now = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 10);

const objPersonnel = {
    fullname: '',
    email: '',
    gender: '',
    citizenIdCode: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    img: '',
    status: '',
    nationality: '',
    users: {
        username: '',
        password: '',
        status: '',
        roles: '',
    },
};

const header = [
    'ID',
    'Họ tên',
    'Email',
    'Giới tính',
    'CCCD',
    'Ngày sinh',
    'Số điện thoại',
    'Địa chỉ',
    'Avatar',
    'Trạng thái',
];

const regexSpace = /^[^\s]+(\s+[^\s]+)*$/;
const regexPhoneNumber = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

const PersonnelSchema = Yup.object().shape({
    fullname: Yup.string()
        .matches(regexSpace, 'Không chỉ để khoảng trắng')
        .required('Tên nhân viên không được để trống'),
    email: Yup.string()
        .email('Sai định dạng email')
        .matches(regexSpace, 'Không chỉ để khoảng trắng')
        .required('Email không được để trống'),
    gender: Yup.string().nullable(),
    citizenIdCode: Yup.number().typeError('CCCD/CMNT phải là số').required('CMND/CCCD không được để trống'),
    dateOfBirth: Yup.string()
        .matches(regexSpace, 'Không chỉ để khoảng trắng')
        .required('Ngày sinh không được để trống'),
    phoneNumber: Yup.string()
        .matches(regexSpace, 'Không chỉ để khoảng trắng')
        .matches(regexPhoneNumber, 'Không đúng định dạng số điện thoại')
        .required('Số điện thoại không được để trống'),
    address: Yup.string().required('Địa chỉ không được để trống'),
    img: Yup.string().matches(regexSpace, 'Không chỉ để khoảng trắng').required('Ảnh không được để trống'),
    status: Yup.string().nullable(),
    nationality: Yup.number().nullable(),
    users: Yup.object({
        username: Yup.string()
            .matches(regexSpace, 'Không chỉ để khoảng trắng')
            .required('Username không được để trống'),
        password: Yup.string()
            .matches(regexSpace, 'Không chỉ để khoảng trắng')
            .required('Mật khẩu không được để trống'),
        status: Yup.string().nullable(),
        roles: Yup.array().nullable(),
    }),
});

function PersonnelManage() {
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleMoneyFirst, setVisibleMoneyFirst] = useState(false);
    const [person, setPerson] = useState(objPersonnel);
    const [valueSearch, setValueSearch] = useState('');
    const handOvers = useSelector((state) => state.handOver.handOvers);
    const personnels = useSelector((state) => state.personnel.personnels);
    const nationalities = useSelector((state) => state.personnel.nationalities);
    const personnel = useSelector((state) => state.personnel.personnel);
    const dispatch = useDispatch();

    const userLogin = handOvers
        .filter((x) => x.status === 0)
        .reduce((prev, current) => (prev.dateTimeStart > current.dateTimeStart ? prev : current), {});

    useEffect(() => {
        dispatch(getAllPersonnel());
        dispatch(getAllNationality());
        dispatch(getAllHandOver());
        setPerson(personnel);
        // eslint-disable-next-line
    }, [personnel]);

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const itemsPerPage = 5;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = personnels.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(personnels.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % personnels.length;
        setItemOffset(newOffset);
    };

    // open the modal delete
    function getIdDelete(id) {
        dispatch(getPersonnelById(id));
        setVisibleDelete(true);
    }
    // open the modal update
    function getIdUpdate(id) {
        dispatch(getPersonnelById(id));
        setVisibleUpdate(true);
    }
    // open the modal add
    function openAdd() {
        setVisibleAdd(true);
    }

    // open the modal money first
    function openMoneyFirst() {
        setVisibleMoneyFirst(true);
    }

    function handleDeleteById() {
        setPerson(person);
        dispatch(update({ ...person, status: '0' }));
        dispatch(getAllPersonnel());
        toast.success('Xóa nhân viên thành công', { autoClose: 2000 });
        setVisibleDelete(false);
    }

    function handleUpdate(data) {
        if (
            personnels
                .filter((x) => x.users.username != data.users?.username)
                .some((x) => x.users.username === data.users?.username)
        ) {
            toast.error('Username đã tồn tại', { autoClose: 2000 });
        } else if (personnels.filter((x) => x.email != data.email).some((x) => x.email === data.email)) {
            toast.error('Email đã tồn tại', { autoClose: 2000 });
        } else {
            dispatch(
                update({ ...data, nationality: nationalities.filter((nat) => nat.id === Number(data.nationality))[0] }),
            );
            toast.success('Cập nhật thành công', { autoClose: 2000 });
            setVisibleUpdate(false);
        }
    }

    function handleAdd(data) {
        if (personnels.some((x) => x.users.username === data.users?.username)) {
            toast.error('Username đã tồn tại', { autoClose: 2000 });
        } else if (personnels.some((x) => x.email === data.email)) {
            toast.error('Email đã tồn tại', { autoClose: 2000 });
        } else {
            dispatch(
                add({
                    ...data,
                    status: 1,
                    gender: data.gender === '' ? 'Nam' : data.gender,
                    users: { ...data.users, status: 1, roles: [] },
                    nationality: nationalities.filter(
                        (nat) =>
                            nat.id ===
                            (data.nationality === undefined ? nationalities[0].id : Number(data.nationality)),
                    )[0],
                }),
            );
            toast.success('Thêm nhân viên thành công', { autoClose: 2000 });
            setVisibleAdd(false);
        }
    }

    function handleFirstMoney(data) {
        dispatch(updateHandOver({ ...userLogin, moneyFirst: Number(data.money) }));
        toast.success('Cập nhật thành công', { autoClose: 2000 });
        setVisibleMoneyFirst(false);
    }

    function handleDownloadExcel() {
        downloadExcel({
            fileName: 'personnel-manage',
            sheet: 'personnel-manage',
            tablePayload: {
                header,
                // accept two different data structures
                body: personnels,
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
                            <span className="px-2">Quản lý nhân viên</span>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="grid grid-cols-6 gap-3 pt-8 px-3">
                <div className="col-start-1 col-end-7">
                    <hr />
                </div>
                <div className="col-start-1 flex justify-center items-center">
                    <p>Tìm kiếm nhân viên</p>
                </div>
                <div className="col-start-2 col-end-5">
                    <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <input
                            type="text"
                            id="email-address-icon"
                            onChange={(e) => setTimeout(() => setValueSearch(e.target.value), 1000)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                </div>
                <div className="col-start-5 flex justify-center items-center">
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
                {handOvers.length === 1 ? (
                    <div className="col-start-7">
                        <button
                            type="button"
                            onClick={() => {
                                openMoneyFirst();
                            }}
                            className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <FontAwesomeIcon icon={faSackDollar} />
                            <span className="mx-2">Tiền đầu ca</span>
                        </button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            <div className="mt-4 p-2">
                <div className="overflow-x-auto relative">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    Avatar
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Tên nhân viên
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Username
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Email
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Địa chỉ
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Giới tính
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Ngày sinh
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    SĐT
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
                                .filter((x) => x.fullname.toLowerCase().includes(valueSearch))
                                .map((x) => (
                                    <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                        <td className="py-4 px-6">
                                            <img src={x.img} alt={x.fullname} className="rounded-sm" width={50} />
                                        </td>
                                        <td className="py-4 px-6">{x.fullname}</td>
                                        <td className="py-4 px-6">{x.users.username}</td>
                                        <td className="py-4 px-6">{x.email}</td>
                                        <td className="py-4 px-6">{x.address}</td>
                                        <td className="py-4 px-6">{x.gender}</td>
                                        <td className="py-4 px-6">{x.dateOfBirth}</td>
                                        <td className="py-4 px-6">{x.phoneNumber}</td>
                                        <td className="py-4 px-6">{x.status === 1 ? 'Hoạt động' : 'Không tồn tại'}</td>
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
                                    Xác nhận xóa nhân viên ?
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
                    <Modal show={visibleUpdate} size="6xl" popup={true} onClose={() => setVisibleUpdate(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    ...person,
                                    fullname: person.fullname || '',
                                    email: person.email || '',
                                    citizenIdCode: person.citizenIdCode || '',
                                    phoneNumber: person.phoneNumber || '',
                                    dateOfBirth: person.dateOfBirth || '',
                                    address: person.address || '',
                                    img: person.img || '',
                                    nationality: person.nationality?.id,
                                    gender: person.gender || '',
                                    users: person.users || '',
                                }}
                                validationSchema={PersonnelSchema}
                                onSubmit={(values) => {
                                    handleUpdate(values);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <div className="grid grid-cols-3 gap-5">
                                            <div className="col-start-1 col-end-4">Thông tin chung</div>
                                            <div>
                                                <label
                                                    htmlFor="fullname"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Họ tên
                                                </label>
                                                <Field
                                                    name="fullname"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.fullname && touched.fullname
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.fullname && touched.fullname ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.fullname}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Email
                                                </label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.email && touched.email ? 'border-2 border-rose-600' : ''
                                                    } `}
                                                />
                                                {errors.email && touched.email ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.email}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="phoneNumber"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Số điện thoại
                                                </label>
                                                <Field
                                                    name="phoneNumber"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.phoneNumber && touched.phoneNumber
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.phoneNumber && touched.phoneNumber ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.phoneNumber}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="citizenIdCode"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    CCCD/CMTND
                                                </label>
                                                <Field
                                                    name="citizenIdCode"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.citizenIdCode && touched.citizenIdCode
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.citizenIdCode && touched.citizenIdCode ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.citizenIdCode}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="dateOfBirth"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Ngày sinh
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="dateOfBirth"
                                                    max={now}
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.dateOfBirth && touched.dateOfBirth
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.dateOfBirth && touched.dateOfBirth ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.dateOfBirth}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="address"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Địa chỉ
                                                </label>
                                                <Field
                                                    name="address"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.address && touched.address
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.address && touched.address ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.address}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="img"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Ảnh
                                                </label>
                                                <Field
                                                    name="img"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${errors.img && touched.img ? 'border-2 border-rose-600' : ''} `}
                                                />
                                                {errors.img && touched.img ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.img}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="gender"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Giới tính
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="gender"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.gender && touched.gender
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                >
                                                    <option value="Nam">Nam</option>
                                                    <option value="Nữ">Nữ</option>
                                                    <option value="Khác">Khác</option>
                                                </Field>
                                                {errors.gender && touched.gender ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.gender}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="nationality"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Quốc gia
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="nationality"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.nationality && touched.nationality
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                >
                                                    {nationalities.map((x) => (
                                                        <option key={x.id} value={x.id}>
                                                            {x.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                                {errors.nationality && touched.nationality ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.nationality}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col-start-1 col-end-4">Thông tin đăng nhập</div>
                                            <div>
                                                <label
                                                    htmlFor="username"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Username
                                                </label>
                                                <Field
                                                    disabled
                                                    name="users.username"
                                                    className="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <Button type="submit">Cập nhật</Button>
                                            <Button color="gray" onClick={() => setVisibleUpdate(false)}>
                                                Đóng
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Modal.Body>
                    </Modal>
                    {/* modal money first */}
                    <Modal show={visibleMoneyFirst} size="xl" popup={true} onClose={() => setVisibleMoneyFirst(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{ money: userLogin.moneyFirst || 0 }}
                                validationSchema={Yup.object().shape({
                                    money: Yup.number()
                                        .positive('Tiền đầu ca phải lớn hơn không')
                                        .typeError('Tiền đầu ca phải là số')
                                        .required('Tiền đầu ca không để để trống'),
                                })}
                                onSubmit={(values) => {
                                    handleFirstMoney(values);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <div>
                                            <label
                                                htmlFor="money"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Tiền đầu ca
                                            </label>
                                            <Field
                                                name="money"
                                                className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.money && touched.money ? 'border-2 border-rose-600' : ''
                                                    } `}
                                            />
                                            {errors.money && touched.money ? (
                                                <div className="text-sm text-red-600 mt-2">{errors.money}</div>
                                            ) : null}
                                        </div>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <Button type="submit">Cập nhật tiền</Button>
                                            <Button color="gray" onClick={() => setVisibleMoneyFirst(false)}>
                                                Đóng
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Modal.Body>
                    </Modal>
                    {/* modal add */}
                    <Modal show={visibleAdd} size="6xl" popup={true} onClose={() => setVisibleAdd(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <Formik
                                initialValues={{ ...objPersonnel, nationality: nationalities[0]?.id }}
                                validationSchema={PersonnelSchema}
                                onSubmit={(values) => {
                                    handleAdd(values);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <div className="grid grid-cols-3 gap-5">
                                            <div className="col-start-1 col-end-4">Thông tin chung</div>
                                            <div>
                                                <label
                                                    htmlFor="fullname"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Họ tên
                                                </label>
                                                <Field
                                                    name="fullname"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.fullname && touched.fullname
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.fullname && touched.fullname ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.fullname}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Email
                                                </label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.email && touched.email ? 'border-2 border-rose-600' : ''
                                                    } `}
                                                />
                                                {errors.email && touched.email ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.email}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="phoneNumber"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Số điện thoại
                                                </label>
                                                <Field
                                                    name="phoneNumber"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.phoneNumber && touched.phoneNumber
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.phoneNumber && touched.phoneNumber ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.phoneNumber}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="citizenIdCode"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    CCCD/CMTND
                                                </label>
                                                <Field
                                                    name="citizenIdCode"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.citizenIdCode && touched.citizenIdCode
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.citizenIdCode && touched.citizenIdCode ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.citizenIdCode}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="dateOfBirth"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Ngày sinh
                                                </label>
                                                <Field
                                                    type="date"
                                                    max={now}
                                                    name="dateOfBirth"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.dateOfBirth && touched.dateOfBirth
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.dateOfBirth && touched.dateOfBirth ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.dateOfBirth}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="address"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Địa chỉ
                                                </label>
                                                <Field
                                                    name="address"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.address && touched.address
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.address && touched.address ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.address}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="img"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Ảnh
                                                </label>
                                                <Field
                                                    name="img"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${errors.img && touched.img ? 'border-2 border-rose-600' : ''} `}
                                                />
                                                {errors.img && touched.img ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.img}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="gender"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Giới tính
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="gender"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.gender && touched.gender
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                >
                                                    <option value="Nam">Nam</option>
                                                    <option value="Nữ">Nữ</option>
                                                    <option value="Khác">Khác</option>
                                                </Field>
                                                {errors.gender && touched.gender ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.gender}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="nationality"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Quốc gia
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="nationality"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.nationality && touched.nationality
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                >
                                                    {nationalities.map((x) => (
                                                        <option key={x.id} value={x.id}>
                                                            {x.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                                {errors.nationality && touched.nationality ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.nationality}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col-start-1 col-end-4">Thông tin đăng nhập</div>
                                            <div>
                                                <label
                                                    htmlFor="username"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Username
                                                </label>
                                                <Field
                                                    name="users.username"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.users?.username && touched.users?.username
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.users?.username && touched.users?.username ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.users?.username}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="password"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Password
                                                </label>
                                                <Field
                                                    type="password"
                                                    name="users.password"
                                                    className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.users?.password && touched.users?.password
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                                />
                                                {errors.users?.password && touched.users?.password ? (
                                                    <div className="text-sm text-red-600 mt-2">
                                                        {errors.users?.password}
                                                    </div>
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

export default PersonnelManage;
