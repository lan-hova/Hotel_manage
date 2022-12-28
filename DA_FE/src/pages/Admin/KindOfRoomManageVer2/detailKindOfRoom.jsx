import { Button, Form, Input, InputNumber, Modal, Switch, Upload } from "antd";
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "~/pages/Loading/loading";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

const DetailKindOfRoom = () => {

    const { type, idKindOfRoom } = useParams();
    const navigate = useNavigate();
    const [kindOfRoom, setKindOfRoom] = useState({
        id: "",
        name: "",
        note: "",
        priceByDay: "",
        hourlyPrice: "",
        status: 1,
    });

    const [initialValues, setInitialValues] = useState();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(initialValues)
    }, [form, initialValues])

    useEffect(
        () => {
            if(type === "DETAIL" && idKindOfRoom) {
                setIsLoading(true);
                getDetailKindOfRoom();
            }
            setTimeout(() => {
                setIsLoading(false)
            }, 500);
        }, []
    )
    

    const getDetailKindOfRoom = async () => {
        await axios
            .get('http://localhost:8080/api/kind-of-room/detail/' + idKindOfRoom)
            .then(
                (res) => {
                    if(res.status === 200) {
                        setKindOfRoom(res.data.kindOfRoom);
                        setInitialValues(
                            {
                                'Tên loại phòng': res.data.kindOfRoom.name,
                                'Giá theo ngày': res.data.kindOfRoom.priceByDay,
                                'Giá theo giờ': res.data.kindOfRoom.hourlyPrice,
                                'Ghi chú': res.data.kindOfRoom.note,
                            }
                        )
                        setFileList(
                            res.data.imageKindOfRoomList.map(
                                (x) => ({
                                    uid: x.id,
                                    id: x.id,
                                    name: "",
                                    status: 'done',
                                    url: x.url,
                                    statusDelete: "NO",
                                })
                            )
                        )
                    }
                }
            )
    }

    const [isLoading, setIsLoading] = useState(false);

    const validateMessages = {
        required: 'Vui lòng nhập ${label}!',
        types: {
          email: '${label} không đúng định dạng!',
          number: '${label} is not a valid number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
        phoneNumber: {
            validator: (_, value) => {
                console.log(_);
                if(value) {
                    if(/(0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject(_.field + ' chưa đúng!');
                }
                return Promise.resolve();
            }
        },
        space: {
            validator: (_, value) => {
                if(value) {
                    if(value.trim()) {
                        return Promise.resolve();
                    }
                    return Promise.reject(_.field + ' không được để trống!');
                }
                return Promise.resolve();
            }
        },
        specialCharacters: {
            validator: (_, value) => {
                if(value) {
                    if(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
                        return Promise.reject(_.field + ' không được có ký tự đặc biệt!');
                    }
                    return Promise.resolve();
                }
                return Promise.resolve();
            }
        }
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([
        // {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //     statusDelete: "NO",
        // },
    ]);

    const [fileListDelete, setFileListDelete] = useState([
        // {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //     statusDelete: "NO",
        // },
    ]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        );
    };

    const handleChange = ({ fileList: newFileList }) => {
        // console.log(newFileList);
        // setFileList(newFileList);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const uploadImgae = async (dataImage) => {
        setIsLoading(true);
        const params = new FormData();
        params.append('file', dataImage);
        params.append('upload_preset', 'image-kind-of-room');
        params.append('cloud_name', 'dmfge68ok');
        params.append('folder', 'kind-of-room');
        await axios
            .post('https://api.cloudinary.com/v1_1/dmfge68ok/image/upload', params)
            .then(
                (res) => {
                    if(res.status === 200) {
                        const image = {
                            uid: res.data.public_id,
                            id: "",
                            name: res.data.public_id,
                            status: 'done',
                            url: res.data.url,
                            statusDelete: "NO",
                        }
                        let listImage = fileList;
                        listImage.push(image);
                        setFileList(listImage);
                        setIsLoading(false);
                    }
                }
            )
        return false;
    }

    const removeImage = (dataImage) => {
        let listImage = fileList;
        let listImageDetlete = fileList;
        listImageDetlete = listImageDetlete.find((x) => x.uid !== dataImage.uid);
        listImage = listImage.filter((x) => x.uid !== dataImage.uid);
        setFileList(listImage);
        setFileListDelete([
            ...fileListDelete,
            listImageDetlete
        ]);
    }

    console.log(fileList);
    console.log(fileListDelete);

    const kindOfRoomAction = async () => {
        setIsLoading(true);
        let imageList = [];
        imageList = fileList && fileList.map((x) => ({
            id: x.id ? Number(x.id) : "",
            url: x.url,
            statusDelete: "NO",
        }))
        let imageListDelete = [];
        imageListDelete = fileListDelete && fileListDelete.map((x) => ({
            id: x.id ? Number(x.id) : "",
            url: x.url,
            statusDelete: "YES",
        }))
        const params = {
            kindOfRoom: kindOfRoom,
            imageList: imageList,
            imageListDelete: imageListDelete,
        };
        if(type === "CREATE") {
            await axios
                .post('http://localhost:8080/api/kind-of-room/create-ver-2', params)
                .then(
                    (res) => {
                        if(res.status === 200) {
                            setIsLoading(false);
                            navigate('/admin/kind-of-room/DETAIL/' + res.data.id);
                            toast('🦄 Thêm mới thành công!', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                    }
                )
        }

        if(type === "DETAIL") {
            await axios
                .post('http://localhost:8080/api/kind-of-room/update', params)
                .then(
                    (res) => {
                        if(res.status === 200) {
                            setIsLoading(false);
                            toast('🦄 Cập nhật thành công!', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                    }
                )
        }
    }

    return (
        <>
            {isLoading && (<Loading></Loading>)}
            <ToastContainer></ToastContainer>
            <div className="font-semibold text-xl">
                Thêm mới loại phòng
            </div>
            <Form
                form={form}
                initialValues={initialValues}
                name="nest-messages"
                onFinish={kindOfRoomAction}
                validateMessages={validateMessages}
            >
                <div className="grid grid-cols-12 gap-28 mt-6">
                    <div className="text-base col-span-4">
                        <div>
                            Tên loại phòng
                            <Form.Item
                                name="Tên loại phòng"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                    validateMessages.space,
                                    validateMessages.specialCharacters,

                                ]}
                                hasFeedback 
                            >
                                <Input
                                    className="mt-1 w-full"
                                    placeholder="Nhập tên loại phòng..."
                                    // value={kindOfRoom.name}
                                    onChange={
                                        (e) => setKindOfRoom({
                                            ...kindOfRoom,
                                            name: e.target.value
                                        })
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <div className="mb-1">
                                Giá theo ngày
                            </div>
                            <Form.Item
                                name="Giá theo ngày"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                ]}
                                hasFeedback 
                                value={kindOfRoom.priceByDay}
                            >
                                <InputNumber
                                    className="w-full"
                                    placeholder="Nhập giá theo ngày..."
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    addonAfter={"VND"}
                                    
                                    onChange={
                                        (e) => setKindOfRoom({
                                            ...kindOfRoom,
                                            priceByDay: e,
                                        })
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <div className="mb-1">
                                Giá theo giờ
                            </div>
                            <Form.Item
                                name="Giá theo giờ"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                ]}
                                hasFeedback 
                            >
                                <InputNumber
                                    className="w-full"
                                    placeholder="Nhập giá theo ngày..."
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    addonAfter={"VND"}
                                    value={kindOfRoom.hourlyPrice}
                                    onChange={
                                        (e) => setKindOfRoom({
                                            ...kindOfRoom,
                                            hourlyPrice: e,
                                        })
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div>
                            Ghi chú
                            <Form.Item
                                name="Ghi chú"
                                rules={[
                                    {   
                                        required: true,

                                    },
                                ]}
                            >
                                <TextArea
                                    showCount
                                    maxLength={100}
                                    style={{ height: 120, resize: 'none' }}
                                    className="w-full"
                                    placeholder="Ghi chú..."
                                    value={kindOfRoom.note}
                                    onChange={
                                        (e) => setKindOfRoom({
                                            ...kindOfRoom,
                                            note: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </div>
                        <div className="mt-14">
                            <Switch
                                checkedChildren="Hoạt động"
                                unCheckedChildren="Ngừng hoạt động"
                                defaultChecked
                                checked={kindOfRoom.status === 1 ? true : false}
                                onChange={
                                    (e) => setKindOfRoom({
                                        ...kindOfRoom,
                                        status: e ? 1 : 2
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="text-base col-span-8">
                        <div>Ảnh</div>
                        <div className="mt-1">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                multiple
                                beforeUpload={uploadImgae}
                                onRemove={removeImage}
                            >
                                {uploadButton}
                            </Upload>
                            <Modal
                                open={previewOpen}
                                title={previewTitle}
                                footer={null}
                                onCancel={handleCancel}
                            >
                                <img
                                    alt="example"
                                    style={{
                                        width: '100%',
                                    }}
                                    src={previewImage}
                                />
                            </Modal>
                        </div>
                    </div>
                </div>
                <div className="mt-12 w-full">
                    <Button
                        className="float-right"
                        htmlType="submit"
                    >
                        {type === "CREATE" && "Thêm mới"}
                        {type === "DETAIL" && "Cập nhật"}
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default DetailKindOfRoom;