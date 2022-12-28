import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBill, getAllRoom } from '~/app/reducers/chart';
import { getAllDetailsInvoice } from '~/app/reducers/detailsInvoice';
import { getAllService } from '~/app/reducers/service';
import { getAllServiceDetail } from '~/app/reducers/serviceDetail';
import BarChart from '~/components/BarChart';

const now = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 10);

const objDate = {
    from: now,
    to: now,
};

function Chart() {
    const [date, setDate] = useState(objDate);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const byRangeHourse = useSelector((state) => state.chart.byRangeHourseData);
    const bills = useSelector((state) => state.chart.bills);
    const rooms = useSelector((state) => state.chart.rooms);
    const totalMoneyService = useSelector((state) => state.serviceDetail.totalMoneyService);
    const totalRoomPrice = useSelector((state) => state.detailsInvoice.totalRoomPrice);
    const dispatch = useDispatch();

    const [byRangeHourseData, setByRangeHourseData] = useState({
        labels: byRangeHourse.map((data) => data.time),
        datasets: [
            {
                label: 'Số khách',
                data: byRangeHourse.map((data) => data.quantity),
                backgroundColor: ['#00a8ff'],
                borderColor: 'black',
                borderWidth: 2,
            },
        ],
    });

    useEffect(() => {
        dispatch(getAllRoom());
        dispatch(getAllBill());
        dispatch(getAllServiceDetail());
        dispatch(getAllDetailsInvoice());
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        let totalDep = 0;
        bills
            .filter((x) => date.from <= x.hireDate.slice(0, 10) && x.hireDate.slice(0, 10) <= date.to)
            .map((x) => (totalDep += x.deposits));
        setTotalDeposits(totalDep);
        // eslint-disable-next-line
    }, [bills, date]);

    useEffect(() => {
        setByRangeHourseData({
            labels: byRangeHourse.map((data) => data.time),
            datasets: [
                {
                    label: 'Số khách',
                    data: byRangeHourse.map((data) => data.quantity),
                    backgroundColor: ['#00a8ff'],
                    borderColor: 'black',
                    borderWidth: 2,
                },
            ],
        });
    }, [byRangeHourse]);

    return (
        <div>
            <div className="grid grid-cols-4 gap-2 px-2 mt-3">
                <div className="col-start-1 col-end-5 border-solid rounded-md p-2 shadow">
                    <div className="grid grid-cols-8">
                        <div className="mr-3 font-bold">Thống kê theo ngày</div>
                        <div className="col-start-2 col-end-9">
                            <label className="mr-3">Từ</label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={now}
                                max={now}
                                onChange={(e) => setDate({ ...date, from: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-80 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <label className="mx-3">đến</label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={now}
                                max={now}
                                onChange={(e) => setDate({ ...date, to: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-80 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-5">
                        <div className="bg-status-2 h-20 p-2 rounded">
                            <p className="font-bold">Tổng tiền phòng</p>
                            <p className="text-white font-bold">{totalRoomPrice.toLocaleString()} VNĐ</p>
                        </div>
                        <div className="bg-design-greenLight h-20 p-2 rounded">
                            <p className="font-bold">Tổng tiền dịch vụ</p>
                            <p className="text-white font-bold">{totalMoneyService.toLocaleString()} VNĐ</p>
                        </div>
                        <div className="bg-status-3 h-20 p-2 rounded">
                            <p className="font-bold">Tiền đặt cọc</p>
                            <p className="text-white font-bold">{totalDeposits.toLocaleString()} VNĐ</p>
                        </div>
                        <div className="bg-status-4.5 h-20 p-2 rounded">
                            <p className="font-bold">Doanh thu</p>
                            <p className="text-white font-bold">
                                {(totalRoomPrice + totalMoneyService).toLocaleString()} VNĐ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-2 mt-3 p-2 rounded shadow">
                <p className="font-bold">Tỷ lệ khách đến theo khung giờ</p>
                <div className="flex justify-center items-center px-16">
                    <BarChart chartData={byRangeHourseData} />
                </div>
            </div>
        </div>
    );
}

export default Chart;
