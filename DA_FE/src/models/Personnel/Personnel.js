import UserPersonnel from './../User/UserPersonnel';

export default class Personnel {
    constructor() {
        this.id = 3;
        this.fullname = 'Bùi Quang Vũ';
        this.email = 'vubq@gmail.com';
        this.gender = 'Nam';
        this.citizenIdCode = '333333333';
        this.dateOfBirth = new Date('2002-03-03');
        this.phoneNumber = '032198765';
        this.address = 'Hải Dương';
        this.img = 'vu.jpg';
        this.status = 1;
        this.nationality = {
            id: 1,
            name: 'Việt Nam',
            status: 1,
        };
        this.users = new UserPersonnel();
    }
}
