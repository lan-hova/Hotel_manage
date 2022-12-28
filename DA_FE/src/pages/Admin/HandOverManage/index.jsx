import { Link } from 'react-router-dom';
import config from '~/config';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tabs } from 'flowbite-react';
import HandOver from './HandOver';
import ResetHandOver from './ResetHandOver';

function HandOverManage() {
    return (
        <div className="text-black pt-6 px-1 pb-5">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link
                            to={config.routes.roomPlan}
                            className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                        >
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faChevronRight} />
                            <span className="px-2">Quản lý giao ca</span>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="p-3">
                <Tabs.Group aria-label="Tabs with underline" style="underline">
                    <Tabs.Item title="Giao ca">
                        <HandOver />
                    </Tabs.Item>
                    <Tabs.Item title="Reset giao ca">
                        <ResetHandOver />
                    </Tabs.Item>
                </Tabs.Group>
            </div>
        </div>
    );
}

export default HandOverManage;
