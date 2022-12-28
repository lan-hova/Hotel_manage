import axios from 'axios';

let username = window.localStorage.getItem('username');

const currentUser = async () => {
    return await axios
        .get('http://localhost:8080/api/personnel')
        .then((res) => getListUser(res))
        .catch((error) => {
            throw Error(error);
        });
};

const getListUser = (response) => {
    // You can handle 400 errors as well.
    if (response.status === 200) {
        return response.data.find((x) => x.users.username === username);
    } else {
        throw Error(response.data | 'error');
    }
};

window.onload = () => {
    currentUser();
};

export default { currentUser, getListUser, username };
