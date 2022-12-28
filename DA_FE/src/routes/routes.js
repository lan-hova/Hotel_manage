import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import LoginAdmin from '~/pages/Admin/LoginAdmin';
import HistoryAdmin from '~/pages/Admin/HistoryAdmin';
import PersonnelManage from '~/pages/Admin/PersonnelManage';
import ServiceManage from '~/pages/Admin/ServiceManage';
import HandOver from '~/pages/Admin/HandOver';
import RentalTypes from '~/pages/Admin/RentalTypeManage';
import CustomerManage from '~/pages/Admin/CustomerManage';
import HandOverManage from '~/pages/Admin/HandOverManage';
import Nationality from '~/pages/Admin/NationalityManage';
import KindOfRoomManage from '~/pages/Admin/KindOfRoomManage';
import Signup from '~/pages/Signup';
import Notfound from '~/pages/Notfound';
import SearchRoom from '~/pages/Customer/SearchRoom';
import RoomDetail from '~/pages/Customer/RoomDetail';
import RoomManage from '~/pages/Admin/RoomManage';
import Chart from '~/pages/Admin/Chart';
import FloorManage from '~/pages/Admin/FloorManage';
import Authorization from '~/pages/Admin/Authorization';
import CreateRoomManage from '~/pages/Admin/CreateRoomManage';
import CreateOptionRoomManage from '~/pages/Admin/CreateOptionRoomManage';
import RoomPlan from '~/pages/Admin/RoomRentalManage/RoomPlan/room-plan';
import RentalManage from '~/pages/Admin/RoomRentalManage/RentalManage/rental-manage';
import BookingManage from '~/pages/Admin/BookingManage';
import ManageBooking from '~/pages/Admin/RoomRentalManage/Booking/ManageBooking/manageBooking';
import CustomerLayout from './../layouts/CustomerVer2/customer-layout';
import Booking from '~/pages/Home/booking';
import Facilities from '~/pages/Admin/FacilityManage';
import KindOfRoomManageVer2 from '~/pages/Admin/KindOfRoomManageVer2/kindOfRoomManage';
import DetailKindOfRoom from '~/pages/Admin/KindOfRoomManageVer2/detailKindOfRoom';

// Routes public

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: CustomerLayout },
    { path: config.routes.bookingSuccess, component: Home, layout: CustomerLayout },
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.room, component: RoomDetail, layout: null },
    { path: config.routes.searchRoom, component: SearchRoom, layout: null },
    { path: config.routes.signup, component: Signup, layout: null },
    { path: config.routes.notfound, component: Notfound, layout: null },
    { path: config.routes.bookingData, component: Booking, layout: CustomerLayout },
    { path: config.routes.bookingNoData, component: Booking, layout: CustomerLayout },
];

const privateRoutes = [
    { path: config.routes.loginAdmin, component: LoginAdmin, layout: null },
    { path: config.routes.roomPlan, component: RoomPlan },
    { path: config.routes.rentalManageDetail, component: RentalManage },
    { path: config.routes.rentalManageCheckIn, component: RentalManage },
    { path: config.routes.historyAdmin, component: HistoryAdmin },
    { path: config.routes.personnelManage, component: PersonnelManage },
    { path: config.routes.serviceManage, component: ServiceManage },
    { path: config.routes.handOver, component: HandOver },
    { path: config.routes.customerManage, component: CustomerManage },
    { path: config.routes.roomManage, component: RoomManage },
    { path: config.routes.floorManage, component: FloorManage },
    { path: config.routes.createRoomManage, component: CreateRoomManage },
    { path: config.routes.createOptionRoomManage, component: CreateOptionRoomManage },
    { path: config.routes.kindOfRoom, component: KindOfRoomManage },
    { path: config.routes.nationality, component: Nationality },
    { path: config.routes.rentalTypeManage, component: RentalTypes },
    { path: config.routes.authorization, component: Authorization },
    { path: config.routes.bookingmanage, component: BookingManage },
    { path: config.routes.manageBooking, component: ManageBooking },
    { path: config.routes.facilityManage, component: Facilities },
    { path: config.routes.kindOfRoomVer2, component: KindOfRoomManageVer2 },
    { path: config.routes.createKindOfRoom, component: DetailKindOfRoom },
    { path: config.routes.detailKindOfRoom, component: DetailKindOfRoom },
];

const privateRoutesDirect = [
    { path: config.routes.chart, component: Chart },
    { path: config.routes.authorization, component: Authorization },
    { path: config.routes.handOverManage, component: HandOverManage },
    { path: config.routes.historyAdmin, component: HistoryAdmin },
];

export { publicRoutes, privateRoutes, privateRoutesDirect };
