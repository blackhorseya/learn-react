import Cookies from 'js-cookie';
import jwt from "jsonwebtoken";

export const tokenHelper = {
    getToken,
    setToken,
    removeToken,
    decode,
};

function getToken() {
    return Cookies.get('__session');
}

function setToken(token) {
    Cookies.set('__session', token);
}

function removeToken() {
    Cookies.remove('__session');
}

function decode(token) {
    return jwt.decode(token);
}
