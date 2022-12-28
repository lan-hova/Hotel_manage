import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { toast } from 'react-toastify';

import { Button } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add, getAllCustomer, getAllNationality } from '~/app/reducers/customer';
import { Link } from 'react-router-dom';
import config from '~/config';

const objCustomer = {
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

const CustomerSchema = Yup.object().shape({
    fullname: Yup.string().required('Tên khách hàng không được để trống'),
    email: Yup.string().email('Sai định dạng email').required('Email không được để trống'),
    gender: Yup.string().nullable(),
    citizenIdCode: Yup.number().typeError('CCCD/CMNT phải là số').required('CMND/CCCD không được để trống'),
    dateOfBirth: Yup.string().required('Ngày sinh không được để trống'),
    phoneNumber: Yup.string().required('Số điện thoại không được để trống'),
    address: Yup.string().required('Địa chỉ không được để trống'),
    img: Yup.string().required('Ảnh không được để trống'),
    status: Yup.string().nullable(),
    nationality: Yup.number().nullable(),
    users: Yup.object({
        username: Yup.string().required('Username không được để trống'),
        password: Yup.string().required('Mật khẩu không được để trống'),
        status: Yup.string().nullable(),
        roles: Yup.array().nullable(),
    }),
});

function Signup() {
    const nationalities = useSelector((state) => state.customer.nationalities);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCustomer());
        dispatch(getAllNationality());
        // eslint-disable-next-line
    }, []);

    function handleAdd(data) {
        dispatch(
            add({
                ...data,
                status: 1,
                gender: data.gender === '' ? 'Nam' : data.gender,
                users: { ...data.users, status: 1, roles: [] },
                nationality: nationalities.filter(
                    (nat) =>
                        nat.id === (data.nationality === undefined ? nationalities[0].id : Number(data.nationality)),
                )[0],
            }),
        );
        toast.success('Đăng ký thành công', { autoClose: 2000 });
    }

    return (
        <div className="px-16 pt-10">
            <div className="px-16">
                <Formik
                    initialValues={{ ...objCustomer, nationality: nationalities[0]?.id }}
                    validationSchema={CustomerSchema}
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
                                        <div className="text-sm text-red-600 mt-2">{errors.phoneNumber}</div>
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
                                        <div className="text-sm text-red-600 mt-2">{errors.citizenIdCode}</div>
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
                                        className={`
                                                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                    ${
                                                        errors.dateOfBirth && touched.dateOfBirth
                                                            ? 'border-2 border-rose-600'
                                                            : ''
                                                    } `}
                                    />
                                    {errors.dateOfBirth && touched.dateOfBirth ? (
                                        <div className="text-sm text-red-600 mt-2">{errors.dateOfBirth}</div>
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
                                        <div className="text-sm text-red-600 mt-2">{errors.nationality}</div>
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
                                        <div className="text-sm text-red-600 mt-2">{errors.users?.username}</div>
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
                                        <div className="text-sm text-red-600 mt-2">{errors.users?.password}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <Button type="submit">Đăng ký</Button>
                                <Button type="button" color="success">
                                    <Link to={config.routes.login}>Đăng nhập</Link>
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default Signup;
