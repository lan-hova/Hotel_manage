import React from 'react';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BsFacebook, BsInstagram, BsYoutube, BsTwitter } from "react-icons/bs";
import { faUser, faTag, faCircleQuestion, faPhone, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const { Header, Content, Footer } = Layout;

const CustomerLayout = ({children}) => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = new useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    padding: '0 144px',
                }}
                className="flex items-center text-base"
            >
                <div
                    className='font-bold text-3xl text-white cursor-pointer hover:text-design-greenLight'
                    onClick={
                        () => navigate("/")
                    }
                >
                    POLYTEL
                </div>
                <div className=' w-full flex items-center justify-end text-white'>
                    <div className='mr-4'>
                        <FontAwesomeIcon className='mr-2' icon={faTag} />
                        Khuyến mãi
                    </div>
                    <div className='mr-4'>
                        <FontAwesomeIcon className='mr-2' icon={faPhone} />
                        Chăm sóc khách hàng
                    </div>
                    <div className='mr-4'>
                        <FontAwesomeIcon className='mr-2' icon={faCircleQuestion} />
                        Tìm hiểu về chúng tôi
                    </div>
                    <div className='mr-8'>
                        <FontAwesomeIcon className='mr-2' icon={faHandshake} />
                        Hợp tác với chúng tôi
                    </div>
                    <div className='mr-4 flex justify-center items-center'>
                        <span className='bg-design-lightGray w-5 h-5 flex justify-center items-center rounded-full text-design-charcoalblack mr-2'>
                            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        </span>
                        Đăng nhập
                    </div>
                    <Button className='text-base h-auto' type="primary">Đăng ký</Button>
                </div>
            </Header>
            <Content
                className="site-layout"
            >
                <div
                    style={{
                        minHeight: "100hv",
                    }}
                    // className="bg-white"
                >
                    {children}
                </div>
            </Content>
            <Footer
                style={{
                    padding: 0,
                }}
            >
                <div className='py-5 px-[280px] bg-design-charcoalblack text-base'>
                    <div className='grid grid-cols-4 gap-12'>
                        <div>
                            <div className='font-bold text-3xl text-white'>
                                POLYTEL
                            </div>
                        </div>
                        <div className='text-gray-500 text-base'>
                            <div className='font-semibold text-lg text-white'>
                                Về Polytel
                            </div>
                            <div className='mt-2'>
                                Cách đặt chỗ
                            </div>
                            <div className='mt-2'>
                                Liên hệ chúng tôi
                            </div>
                            <div className='mt-2'>
                                Trợ giúp
                            </div>
                            <div className='mt-2'>
                                Tuyển dụng
                            </div>

                            <div className='font-semibold text-lg text-white mt-6'>
                                Theo dõi chúng tôi
                            </div>
                            <div className='mt-2 flex items-center'>
                                <BsTwitter className='mr-2'></BsTwitter> Twitter
                            </div>
                            <div className='mt-2 flex items-center'>
                                <BsFacebook className='mr-2'></BsFacebook> Facebook
                            </div>
                            <div className='mt-2 flex items-center'>
                                <BsInstagram className='mr-2'></BsInstagram> Instagram
                            </div>
                            <div className='mt-2 flex items-center'>
                                <BsYoutube className='mr-2'></BsYoutube> Youtube
                            </div>
                        </div>
                        <div className='text-gray-500'>
                            <div className='font-semibold text-lg text-white'>
                                Sản phẩm
                            </div>
                            <div className='mt-2'>
                                Nhà nghỉ
                            </div>
                            <div className='mt-2'>
                                Khách sạn
                            </div>
                        </div>
                        <div className='text-gray-500'>
                            <div className='font-semibold text-lg text-white'>
                                Khác
                            </div>
                            <div className='mt-2'>
                                Chính sách quyền riêng tư
                            </div>
                            <div className='mt-2'>
                                Điều khoản & Điều kiện
                            </div>
                            <div className='mt-2'>
                                Quy chế hoạt động
                            </div>
                            <div className='mt-2'>
                                Khu vực báo chí
                            </div>
                        </div>
                    </div>
                </div>
            </Footer>
        </Layout>
    );
};
export default CustomerLayout;