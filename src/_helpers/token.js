import Cookies from 'js-cookie';
import jwt from "jsonwebtoken";

export const tokenHelper = {
    getToken,
    setToken,
    removeToken,
    verifyToken,
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

function verifyToken(token) {
    return jwt.verify(token, '1234567890abcdef');
}
