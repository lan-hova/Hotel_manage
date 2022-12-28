import { Divider, Select, Input, Card } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import ServiceDetail from '~/models/ServiceDetail/ServiceDetail';
import axios from 'axios';

function Services({ detailInvoices, serviceDetails, setServiceDetails }) {

    //Data
    const [servicesByServiceType, setServicesByServiceType] = useState();
    const [serviceType, setServiceType] = useState();
    const [queryServiceType, setQueryServiceType] = useState("ALL");
    const [query, setQuery] = useState("");
    //End Data

    //Created
    useEffect(() => {
        getAllServiceByType();
        getAllServiceType();
    }, [])
    //End Created

    //Gen Data
    const genOptionsKindOfRoom = () => {
        const array = [{ value: "ALL", label: "ALL" }];
        if(serviceType) {
            serviceType.forEach((element) => {
                array.push({ value: element.name, label: element.name });
            });
        }
        return array;
    };
    const filterService = () => {
        let filter = [];
        if(servicesByServiceType) {
            filter = servicesByServiceType;
            if (queryServiceType !== 'ALL') {
                filter = servicesByServiceType.filter((element) => element.serviceType === queryServiceType);
            }
            filter = filter.map((element) => ({
                ...element,
                listService: element.listService.filter((element2) => {
                    return element2.name
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .includes(query.toLowerCase().replace(/\s+/g, ''));
                }),
            }));
        }
        return filter;
    };
    //End Gen Data

    //Function
    const getAllServiceByType = async () => {
        await axios.get("http://localhost:8080/api/service/all-by-type")
                .then(res => {
                    setServicesByServiceType(res.data);
                }).catch(err => {});
    }
    const getAllServiceType = async () => {
        await axios.get("http://localhost:8080/api/service-type")
                .then(res => {
                    setServiceType(res.data);
                }).catch(err => {});
    }
    const addService = (service) => {
        let array = serviceDetails;
        for (let i = 0; i < detailInvoices.length; i++) {
            if (detailInvoices[i].selected === true) {
                if (array.length === 0) {
                    const newServiceDetail = new ServiceDetail();
                    newServiceDetail.servicess = service;
                    newServiceDetail.detailsInvoice = detailInvoices[i];
                    newServiceDetail.quantity = 1;
                    array = [...array, newServiceDetail];
                    continue;
                } else {
                    let exist = array.find(
                        (element) =>
                            element.servicess.id === service.id &&
                            element.detailsInvoice.rooms.id === detailInvoices[i].rooms.id,
                    );
                    let indexChange = array.findIndex(
                        (element) =>
                            element.servicess.id === service.id &&
                            element.detailsInvoice.rooms.id === detailInvoices[i].rooms.id,
                    );
                    // console.log({ ...check, quantity: check.quantity + 1 });
                    if (exist) {
                        array = array.map((element, index) => {
                            if (index === indexChange) {
                                return { ...element, quantity: element.quantity + 1 };
                            } else {
                                return element;
                            }
                        });
                        continue;
                    } else {
                        const newServiceDetail = new ServiceDetail();
                        newServiceDetail.servicess = service;
                        newServiceDetail.detailsInvoice = detailInvoices[i];
                        newServiceDetail.quantity = 1;
                        array = [...array, newServiceDetail];
                        continue;
                    }
                }
            }
        }
        setServiceDetails(array);
    };
    //End Function

    //Util
    const formatCurrency = (value) => {
        return value.toLocaleString("it-IT", {style : "currency", currency : "VND"});
    };
    //End Util

    return (
        <div className="">
            <Divider orientation="left">
                <div className="text-base font-semibold">Dịch vụ</div>
            </Divider>
            <div>
                <div>
                    <div className='text-base font-semibold'>Loại dịch vụ</div>
                    <div className="flex gap-6 mt-[2px]">
                        <Select
                            size='large'
                            defaultValue={genOptionsKindOfRoom()[0].value}
                            style={{ width: 150 }}
                            options={genOptionsKindOfRoom()}
                            onChange={(value) => {
                                setQueryServiceType(value);
                            }}
                            className="font-semibold"
                        />
                        <Input
                            size='large'
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                            }}
                            placeholder="Search..."
                            prefix={<SearchOutlined />}
                        />
                    </div>
                    <div className="">
                        {filterService().map((element, index) => {
                            return (
                                <div key={index}>
                                    {/* <Divider orientation="left">
                                        <div className="text-base">{element.serviceType}</div>
                                    </Divider> */}
                                    <Card title={element.serviceType} className="text-base mt-3">
                                        <div className='grid grid-cols-4 gap-3'>
                                            {element.listService.map((element2, index) => {
                                                return (
                                                    <div
                                                        className='border border-1 rounded-lg px-3 py-1 hover:border-design-greenLight cursor-pointer select-none'
                                                        onClick={() => {
                                                            addService(element2);
                                                        }}
                                                    >
                                                        <div>{element2.name}</div>
                                                        <div>{formatCurrency(element2.prices)}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Services;
