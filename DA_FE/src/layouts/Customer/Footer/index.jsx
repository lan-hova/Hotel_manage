import logo from '~/assets/images/logo250x250.png';

import { Link } from 'react-router-dom';
import config from '~/config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <div className="mt-16 p-10 bg-blue-600 text-white">
            <div className="grid grid-cols-4">
                <div className="flex justify-center items-center">
                    <img src={logo} alt="logo" width={200} height={200} />
                </div>
                <div>
                    <h5>Về chúng tôi</h5>
                    <div className="grid grid-flow-row mt-5">
                        <Link to={config.routes.roomPlan} className="text-slate-300">
                            Giới thiệu
                        </Link>
                        <Link to={config.routes.roomPlan} className="text-slate-300">
                            Liên hệ
                        </Link>
                        <Link to={config.routes.roomPlan} className="text-slate-300">
                            Chính sách bảo mật
                        </Link>
                        <Link to={config.routes.roomPlan} className="text-slate-300">
                            Điều khoản sử dụng
                        </Link>
                        <Link to={config.routes.roomPlan} className="text-slate-300">
                            Đơn vị hợp tác
                        </Link>
                    </div>
                </div>
                <div>
                    <h5>Sản phẩm</h5>
                    <div className="grid grid-flow-row mt-5">
                        <Link to={config.routes.roomPlan} className="text-slate-300">
                            Đặt phòng khách sạn
                        </Link>
                        <Link to={config.routes.roomPlan} className="text-slate-300">
                            Tư vấn đặt phòng
                        </Link>
                        <Link to={config.routes.roomPlan} className="text-slate-300">
                            Chăm sóc khách hàng
                        </Link>
                    </div>
                </div>
                <div>
                    <h5>Kết nối</h5>
                    <div className="grid grid-cols-3 gap-2 text-center mt-5">
                        <Link to={config.routes.roomPlan} className="p-1 bg-blue-400 text-white rounded-md border-2">
                            <span className="mr-2 text-sm">Facebook</span>
                            <FontAwesomeIcon icon={faFacebookF} />
                        </Link>
                        <Link to={config.routes.roomPlan} className="p-1 bg-amber-400 text-white rounded-md border-2">
                            <span className="mr-2 text-sm">Instagram</span>
                            <FontAwesomeIcon icon={faInstagram} />
                        </Link>
                        <Link to={config.routes.roomPlan} className="p-1 bg-red-500 text-white rounded-md border-2">
                            <span className="mr-2 text-sm">Email</span>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </Link>
                    </div>
                </div>
            </div>
            {/* Contact social */}
            <hr />
            <div className="text-center mt-10">
                <h5>All rights reserved @2022 - PolyTel</h5>
            </div>
        </div>
    );
}

export default Footer;
