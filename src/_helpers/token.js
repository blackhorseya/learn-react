import Cookies from 'js-cookie';
import jwt from "jsonwebtoken";

export function getToken() {
    return Cookies.get('__session');
}

export function setToken(token) {
    Cookies.set('__session', token);
}

export function removeToken() {
    Cookies.remove('__session');
}

export function verifyToken(token) {
    return jwt.verify(token, '1234567890abcdef');
}
