import dayjs from "dayjs";

export default class Bill {
    constructor() {
        this.personnel = null;
        this.customer = null;
        this.numberOfAdults = 1;
        this.numberOfKids = 0;
        this.paymentType = {
            id: 1,
            name: 'Tiền mặt',
            status: 0,
        };
        this.hireDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm');
        this.checkOutDay = "2022-12-04 12:00";
        this.dateOfPayment = null;
        this.totalCash = null;
        this.totalCard = null;
        this.deposits = 0;
        this.status = 1;
        this.roomRefundConditions = null;
        this.customerPay = 0;
        this.customerReturnMoney = 0;
    }
}
