import { Link } from 'react-router-dom';
import config from '~/config';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';
import authorServices from '~/services/authorServices';

import { Button, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add as addAutho, getAllAuthority } from '~/app/reducers/authority';
import { getAllPersonnel, getPersonnelById, update } from '~/app/reducers/personnel';

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

const objAuth = {
    roles: {
        name: '',
        status: '',
    },
    users: {
        username: '',
        password: '',
        status: '',
        roles: '',
    },
};

function Authorization() {
    const [person, setPerson] = useState(objPersonnel);
    const [autho, setAutho] = useState(objAuth);
    const [visibleCheckAdmin, setVisibleCheckAdmin] = useState(false);
    const [visibleUnCheckAdmin, setVisibleUnCheckAdmin] = useState(false);
    const [visibleCheckDirector, setVisibleCheckDirector] = useState(false);
    const [visibleUnCheckDirector, setVisibleUnCheckDirector] = useState(false);
    const personnels = useSelector((state) => state.personnel.personnels);
    const personnel = useSelector((state) => state.personnel.personnel);
    const authorities = useSelector((state) => state.authority.authorities);
    const dispatch = useDispatch();

    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        dispatch(getAllPersonnel());
        dispatch(getAllAuthority());
        setPerson(personnel);
        // eslint-disable-next-line
    }, [personnel]);

    useEffect(() => {
        authorServices.currentUser().then((res) => setCurrentUser(res));
    }, []);

    function getIdAdmin(id, e, idUser) {
        const Auth = authorities.find((x) => x.users.id === idUser);
        dispatch(getPersonnelById(id));
        if (e.target.checked === false) {
            setVisibleCheckAdmin(true);
        } else {
            setVisibleUnCheckAdmin(true);
        }
        setAutho(Auth);
    }

    function getIdDirector(id, e) {
        dispatch(getPersonnelById(id));
        if (e.target.checked === false) {
            setVisibleCheckDirector(true);
        } else {
            setVisibleUnCheckDirector(true);
        }
    }

    function handleRoleChangeAdmin() {
        const deleteRole = person.users.roles.filter((x) => x.id !== 2);
        if (visibleCheckAdmin) {
            dispatch(
                update({
                    ...person,
                    users: {
                        ...person.users,
                        roles: deleteRole,
                    },
                }),
            );
            setVisibleCheckAdmin(false);
        } else {
            dispatch(
                addAutho({
                    roles: {
                        id: 2,
                        name: 'Nhân viên',
                        status: 1,
                    },
                    users: person.users,
                }),
            );
            window.location.reload();
            setVisibleUnCheckAdmin(false);
        }
        toast.success('Cập nhật thành công', { autoClose: 2000 });
    }

    function handleRoleChangeDirect(id, e) {
        const deleteRole = person.users.roles.filter((x) => x.id !== 1);
        if (visibleCheckDirector) {
            dispatch(
                update({
                    ...person,
                    users: {
                        ...person.users,
                        roles: deleteRole,
                    },
                }),
            );
            setVisibleCheckDirector(false);
        } else {
            dispatch(
                addAutho({
                    status: 1,
                    roles: {
                        id: 1,
                        name: 'Quản lý',
                        status: 1,
                    },
                    users: person.users,
                }),
            );
            window.location.reload();
            setVisibleUnCheckDirector(false);
        }
        toast.success('Cập nhật thành công', { autoClose: 2000 });
    }

    return (
        <div className="text-black pt-6 p-5">
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
                            <span className="px-2">Phân quyền nhân viên {currentUser?.users.username}</span>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="pt-8">
                <div className="mb-6">
                    <hr />
                </div>
                <div>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    Họ tên
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    Nhân viên
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    Quản lý
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {personnels.map((x) => (
                                <tr className="bg-white dark:bg-gray-800" key={x.id}>
                                    <td className="py-4 px-6">
                                        {x.fullname}
                                        {x.users?.username === currentUser?.users.username ? (
                                            <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                                                Hiện tại
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <input
                                            role="button"
                                            checked={x.users.roles.find((x) => x.name === 'Nhân viên') ? true : false}
                                            id={x.id}
                                            type="checkbox"
                                            value="admin"
                                            onChange={(e) => getIdAdmin(x.id, e, x.users.id)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <input
                                            role="button"
                                            checked={
                                                x.users.roles.findIndex((x) => x.name === 'Quản lý') === 0
                                                    ? true
                                                    : false
                                            }
                                            id={x.id}
                                            type="checkbox"
                                            value="director"
                                            onChange={(e) => getIdDirector(x.id, e)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Modal check admin */}
                    <Modal show={visibleCheckAdmin} size="xl" popup={true} onClose={() => setVisibleCheckAdmin(false)}>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Bạn chắc muốn thay đổi quyền nhân viên ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleRoleChangeAdmin();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleCheckAdmin(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    {/* Modal uncheck admin */}
                    <Modal
                        show={visibleUnCheckAdmin}
                        size="xl"
                        popup={true}
                        onClose={() => setVisibleUnCheckAdmin(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Bạn chắc muốn thay đổi quyền nhân viên ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleRoleChangeAdmin();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleUnCheckAdmin(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    {/* Modal check director */}
                    <Modal
                        show={visibleCheckDirector}
                        size="xl"
                        popup={true}
                        onClose={() => setVisibleCheckDirector(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Bạn chắc muốn thay đổi quyền nhân viên ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleRoleChangeDirect();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleCheckDirector(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    {/* Modal uncheck director */}
                    <Modal
                        show={visibleUnCheckDirector}
                        size="xl"
                        popup={true}
                        onClose={() => setVisibleUnCheckDirector(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Bạn chắc muốn thay đổi quyền nhân viên ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={() => {
                                            handleRoleChangeDirect();
                                        }}
                                    >
                                        Đồng ý
                                    </Button>
                                    <Button color="gray" onClick={() => setVisibleUnCheckDirector(false)}>
                                        Không, đóng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Authorization;
