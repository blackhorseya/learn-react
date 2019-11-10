import { appHeader, authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    getById,
    getAll,
}

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { ...appHeader() },
        body: JSON.stringify({ username, password })
    }

    return fetch(`http://localhost:5000/api/v1/user/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    localStorage.removeItem('user');
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`http://localhost:5000/api/v1/user/${id}`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    return fetch(`http://localhost:5000/api/v1/user`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
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