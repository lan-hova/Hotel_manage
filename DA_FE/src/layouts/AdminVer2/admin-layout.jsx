import {
    BellFilled,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './admin-layout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowsRotate,
    faBarsProgress,
    faHotel,
    faListCheck,
    faRightBracket,
    faBed,
    faBell,
    faRightFromBracket,
    faShield,
    faPersonWalkingArrowLoopLeft,
    faChartSimple,
} from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHandOver } from '~/app/reducers/handOver';
import { update as updateHandOver } from '~/app/reducers/handOver';
import { toast } from 'react-toastify';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import authorServices from '~/services/authorServices';
import { getAllHistory, update as updateHistory } from '~/app/reducers/history';

const { Header, Sider, Content } = Layout;

const objConfirm = {
    moneyReal: '',
    note: '',
};

const ConfirmSchema = Yup.object().shape({
    moneyReal: Yup.number().typeError('Tiền phải là số').required('Tiền thực nhận không được để trống'),
    note: Yup.string().required('Ghi chú không được để trống'),
});

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isHandOver, setIsHandOver] = useState(true);
    const histories = useSelector((state) => state.history.histories);
    const navigate = new useNavigate();
    const [notice, setNotice] = useState(false);
    const handOvers = useSelector((state) => state.handOver.handOvers);
    const userLogin = handOvers
        .filter((x) => x.status === 0)
        .reduce((prev, current) => (prev.dateTimeStart > current.dateTimeStart ? prev : current), {});
    const index = handOvers.findIndex((x) => x === userLogin);
    const dispatch = useDispatch();

    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        dispatch(getAllHandOver());
        dispatch(getAllHistory());
        authorServices.currentUser().then((res) => setCurrentUser(res));
        // eslint-disable-next-line
    }, []);

    function showNotice() {
        setNotice(true);
    }

    function handleConfirm(data) {
        dispatch(
            updateHandOver({
                ...userLogin,
                personnel: currentUser,
                note: userLogin.note + '. ' + data.note,
                moneyReal: Number(data.moneyReal),
            }),
        );
        dispatch(updateHistory({ ...histories[histories.length - 1], handOverStatus: 0, status: 1 }));
        dispatch(updateHistory({ ...histories[histories.length - 2], handOverStatus: 1, status: 0 }));
        toast.success('Nhận ca thành công', { autoClose: 2000 });
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo bg-white h-8 m-4 min" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <FontAwesomeIcon icon={faHotel}></FontAwesomeIcon>,
                            label: 'Phòng',
                            children: [
                                {
                                    key: '17',
                                    // icon: <UploadOutlined />,
                                    label: 'Sơ đồ phòng',
                                    onClick: () => navigate('/admin/room-plan'),
                                },
                                {
                                    key: '18',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản lý booking',
                                    onClick: () => navigate('/admin/manage-booking'),
                                },
                                {
                                    key: '20',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản loại phòng Ver2',
                                    onClick: () => navigate('/admin/kind-of-room-ver2'),
                                },
                            ],
                        },
                        {
                            key: '2',
                            icon: <FontAwesomeIcon icon={faBarsProgress} />,
                            label: 'Quản lý',
                            children: [
                                {
                                    key: '3',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản lý tầng',
                                    onClick: () => navigate('/admin/floor-manage'),
                                },
                                {
                                    key: '4',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản lý phòng',
                                    onClick: () => navigate('/admin/room-manage'),
                                },
                                {
                                    key: '5',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản lý loại phòng',
                                    onClick: () => navigate('/admin/kind-of-room'),
                                },
                                {
                                    key: '6',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản lý nhân viên',
                                    onClick: () => navigate('/admin/personnel-manage'),
                                },
                                {
                                    key: '7',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản lý khách hàng',
                                    onClick: () => navigate('/admin/customer-manage'),
                                },
                                {
                                    key: '8',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản lý dịch vụ',
                                    onClick: () => navigate('/admin/service-manage'),
                                },
                                {
                                    key: '19',
                                    // icon: <UploadOutlined />,
                                    label: 'Quản lý cơ sở',
                                    onClick: () => navigate('/admin/facility-manage'),
                                },
                                {
                                    key: '9',
                                    // icon: <UploadOutlined />,
                                    label: 'Hóa đơn',
                                    // onClick: () => setCollapsed(!collapsed),
                                },
                            ],
                        },
                        {
                            key: '10',
                            icon: <FontAwesomeIcon icon={faArrowsRotate}></FontAwesomeIcon>,
                            label: 'Giao ca',
                            children: [
                                {
                                    key: '11',
                                    // icon: <UploadOutlined />,
                                    label: 'Giao ca',
                                    onClick: () => navigate('/admin/hand-over'),
                                },
                                {
                                    key: '12',
                                    disabled: !currentUser?.users.roles.some((x) => x.name === 'Quản lý'),
                                    // icon: <UploadOutlined />,
                                    label: 'Lịch sử giao ca',
                                    onClick: () => navigate('/admin/hand-over-manage'),
                                },
                            ],
                        },

                        {
                            key: '14',
                            disabled: !currentUser?.users.roles.some((x) => x.name === 'Quản lý'),
                            icon: <FontAwesomeIcon icon={faChartSimple} />,
                            label: 'Thống kê',
                            onClick: () => navigate('/admin/chart'),
                        },
                        {
                            key: '15',
                            disabled: !currentUser?.users.roles.some((x) => x.name === 'Quản lý'),
                            icon: <FontAwesomeIcon icon={faShield} />,
                            label: 'Phân quyền',
                            onClick: () => navigate('/admin/authorization'),
                        },
                        {
                            key: '13',
                            disabled: !currentUser?.users.roles.some((x) => x.name === 'Quản lý'),
                            icon: <FontAwesomeIcon icon={faPersonWalkingArrowLoopLeft} />,
                            label: 'Lịch sử truy cập',
                            onClick: () => navigate('/admin/history'),
                        },
                        {
                            key: '16',
                            icon: <FontAwesomeIcon icon={faRightFromBracket} />,
                            label: 'Đăng xuất',
                            onClick: () => {
                                navigate('/admin/login');
                                dispatch(
                                    updateHistory({ ...histories[histories.length - 1], status: 0, handOverStatus: 0 }),
                                );
                            },
                        },
                    ]}
                ></Menu>
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                        textAlign: 'right',
                    }}
                >
                    <span className="font-bold">Xin chào {currentUser?.fullname} !</span>
                    {collapsed && (
                        <MenuUnfoldOutlined
                            className="trigger text-lg m-3"
                            onClick={() => {
                                setCollapsed(!collapsed);
                            }}
                        ></MenuUnfoldOutlined>
                    )}
                    {!collapsed && (
                        <MenuFoldOutlined
                            className="trigger text-lg m-3"
                            onClick={() => {
                                setCollapsed(!collapsed);
                            }}
                        ></MenuFoldOutlined>
                    )}
                    <BellFilled onClick={showNotice} className="trigger text-lg mr-3" />
                    <Modal
                        show={histories[histories.length - 1]?.handOverStatus === 1 ? true : false}
                        size="3xl"
                        popup={true}
                        onClose={() => setNotice(false)}
                    >
                        <Modal.Header>
                            <div className="p-3">Thông báo giao ca</div>
                        </Modal.Header>
                        <Modal.Body>
                            <Formik
                                initialValues={objConfirm}
                                validationSchema={ConfirmSchema}
                                onSubmit={(values) => {
                                    handleConfirm(values);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-start-1 col-end-3 text-blue-500">{userLogin.note}</div>
                                            <div className="col-start-1 col-end-3">
                                                <p>
                                                    Số tiền mặt bàn giao ca :
                                                    {handOvers[index - 1]?.moneyHandOver.toLocaleString()}đ
                                                </p>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="moneyReal"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Tiền thực nhận
                                                </label>
                                                <Field
                                                    name="moneyReal"
                                                    className={`
                                                        bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                                        ${
                                                            errors.moneyReal && touched.moneyReal
                                                                ? 'border-2 border-rose-600'
                                                                : ''
                                                        } `}
                                                />
                                                {errors.moneyReal && touched.moneyReal ? (
                                                    <div className="text-sm text-red-600 mt-2">{errors.moneyReal}</div>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="note"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Ghi chú
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="note"
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
                                            <Button type="submit">Xác nhận</Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Modal.Body>
                    </Modal>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                    {/* <FloatButton.BackTop /> */}
                </Content>
            </Layout>
        </Layout>
    );
};
export default AdminLayout;
