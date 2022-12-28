import { DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function RoomServices({ detailInvoices, setDetailInvoices, serviceDetails, setServiceDetails }) {

    //Data
    const columns = [
        { title: 'Dịch vụ', dataIndex: 'servicess', key: '1',
            render: (servicess) => <div>{servicess.name}</div>,
        },
        { title: 'Loại dịch vụ', dataIndex: 'servicess', key: '2',
            render: (servicess) => <div>{servicess.serviceType.name}</div>,
        },
        { title: 'Đơn giá', dataIndex: 'servicess', key: '3',
            render: (servicess) => <div>{formatCurrency(servicess.prices)}</div>,
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: '4' },
        // { title: 'Tổng tiền', dataIndex: 'totalCash', key: '5',
        //     render: (totalCash, element) => <div>{element.servicess.prices * element.quantity} VNĐ</div>,
        // },
        { title: '', dataIndex: '', key: '6',
            render: (value, element) => (
                <div className="font-semibold w-full flex justify-center items-center">
                    <Button
                        onClick={() => {
                            removeService(element);
                        }}
                    ><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></Button>
                </div>
            ),
        },
    ];
    //End Data

    //Created
    //End Created

    //Gen Data
    const genServiceDetailsByRoom = (roomId) => {
        if (serviceDetails)
            return serviceDetails.filter(
                (element) => element.detailsInvoice.rooms.id === roomId && element.quantity !== 0,
            );
    };
    //End Gen Data

    //Function
    const changeSelected = (key) => {
        setDetailInvoices(
            detailInvoices.map((element) => {
                if (element.key === key) {
                    return {
                        ...element,
                        selected: !element.selected,
                    };
                } else {
                    return element;
                }
            }),
        );
    };
    const removeService = (serviceDetail) => {
        setServiceDetails(
            serviceDetails.map((element) => {
                if (
                    element.servicess.id === serviceDetail.servicess.id &&
                    element.detailsInvoice.rooms.id === serviceDetail.detailsInvoice.rooms.id
                ) {
                    return { ...element, quantity: 0 };
                } else {
                    return element;
                }
            }),
        );
        //Delete
        // setServiceDetails(
        //     serviceDetails.filter(
        //         (element) =>
        //             !(
        //                 element.servicess.id === serviceDetail.servicess.id &&
        //                 element.detailsInvoice.rooms.id === serviceDetail.detailsInvoice.rooms.id
        //             ),
        //     ),
        // );
    };
    //End Function

    //Util
    const formatCurrency = (value) => {
        return value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    };
    //End Util

    return (
        <div className="">
            <Divider orientation="left">
                <div className="text-base font-semibold">Danh sách phòng</div>
            </Divider>
            {detailInvoices.map((element, index) => {
                if(element.status !== 4) {
                    return (
                        <div key={index}>
                            <Divider orientation="left">
                                <div className="text-base font-semibold">
                                    <div className="ml-2">
                                        <Checkbox
                                            onClick={() => {
                                                changeSelected(element.key);
                                            }}
                                            checked={element.selected}
                                        >{element.rooms.name}</Checkbox>
                                    </div>
                                </div>
                            </Divider>
                            <Table
                                size="middle"
                                locale={{emptyText: "Chưa có dịch vụ nào!"}}
                                bordered
                                pagination={false}
                                columns={columns}
                                dataSource={genServiceDetailsByRoom(element.rooms.id)}
                            />
                        </div>
                    );
                }
            })}
        </div>
    );
}

export default RoomServices;
