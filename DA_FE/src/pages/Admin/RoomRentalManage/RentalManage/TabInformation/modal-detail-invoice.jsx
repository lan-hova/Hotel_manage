import { DatePicker, InputNumber, message, Select } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

function ModalDetailInvoice({ detailModalDetailInvoice, setDetailModalDetailInvoice, setDetailInvoices, rentalTypeList }) {

    //Data
    //End Data

    //Created
    //End Created

    //Gen Data
    const genRentalType = () => {
        const array = [];
        if(rentalTypeList) {
            rentalTypeList.forEach((element) => {
                array.push({ value: element.id, label: element.name });
            });
        }
        return array;
    };
    //End Gen Data

    //Function
    const changeRentalType = (value) => setDetailModalDetailInvoice({...detailModalDetailInvoice, rentalTypes: rentalTypeList.find((element) => element.id === value)});
    
    const changeNumberOfPeople = (value) => {
        if(value === 0 || value < 0) {
            value = 1;
        }
        setDetailModalDetailInvoice({ ...detailModalDetailInvoice, numberOfPeople: Number(value) });
    };

    const changeHireDate = (date, dateString) => setDetailModalDetailInvoice({ ...detailModalDetailInvoice, hireDate: date !== null ? formatDateTime(dateString) : null });
    
    const changeCheckOutDay = (date, dateString) => setDetailModalDetailInvoice({ ...detailModalDetailInvoice, checkOutDay: date !== null ? formatDateTime(dateString) : null });
    //End Function

    //Util
    const formatDateTime = (value) => {
        let arrayDateTime = value.split(' ');
        let arrayDate = arrayDateTime[0].split('-');
        return arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0] + ' ' + arrayDateTime[1];
    };
    //End Util


    return (
        <div>
            {/* <div className="mt-3">Loại phòng: { detailModalDetailInvoice.rooms.kindOfRoom.name }</div> */}
            <div className="mt-3">
                Loại hình thuê
                <Select
                    onChange={(e) => changeRentalType(e)}
                    className="ml-3 w-28"
                    value={
                        detailModalDetailInvoice.rentalTypes ? genRentalType().find((element) => element.value === detailModalDetailInvoice.rentalTypes.id).value
                        : rentalTypeList ? genRentalType()[0].value
                        : ""
                    }
                    options={genRentalType()}
                />
            </div>
            <div className="mt-3">
                Ngày & Giờ Check in
                <DatePicker
                    className="ml-3"
                    format="DD-MM-YYYY HH:mm"
                    showTime={{format: 'HH:mm'}}
                    placeholder="Ngày & giờ check in"
                    value={ detailModalDetailInvoice.hireDate !== null ? dayjs(detailModalDetailInvoice.hireDate) : "" }
                    onChange={ (date, dateString) => changeHireDate(date, dateString) }
                    // disabled
                />
            </div>
            <div className="mt-3">
                Ngày & Giờ Check out
                <DatePicker
                    className="ml-3"
                    format="DD-MM-YYYY HH:mm"
                    showTime={{format: 'HH:mm'}}
                    placeholder="Ngày & giờ check out"
                    value={ detailModalDetailInvoice.checkOutDay !== null ? dayjs(detailModalDetailInvoice.checkOutDay) : "" }
                    onChange={ (date, dateString) => changeCheckOutDay(date, dateString) }
                />
            </div>
        </div>
    );
}

export default ModalDetailInvoice;