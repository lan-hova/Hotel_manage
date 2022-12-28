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
            if(value) {
                if(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(value)) {
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
                if(/^[^\s]+(\s+[^\s]+)*$/.test(value)) {
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
    },
    positiveNumbers: {
        validator: (_, value) => {
            if(value) {
                if(value < 0) {
                    return Promise.reject(_.field + ' phải là số dương!');
                }
                return Promise.resolve();
            }
            return Promise.resolve();
        }
    }
};

export default validateMessages;