import { tokenHelper } from '.';

export function authHeader() {
    let token = tokenHelper.getToken();

    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}