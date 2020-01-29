import {appHeader, authHeader, tokenHelper} from '../_helpers';

export const userService = {
    login,
    logout,
    getById,
    getAll,
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {...appHeader()},
        body: JSON.stringify({username, password})
    };

    return fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/user/authenticate`, requestOptions)
        .then(handleResponse)
        .then(res => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            const result = tokenHelper.verifyToken(res.token);

            tokenHelper.setToken(res.token);
            return result;
        });
}

function logout() {
    tokenHelper.removeToken();
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/user/${id}`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: {...authHeader(), ...appHeader()}
    };

    return fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/user`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // auto logout if 401 response returned from api
                logout();
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}