import { getToken } from '.';

export function authHeader() {
    let token = getToken();

    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}