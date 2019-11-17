import { userConstants } from '../_constants';
import Cookies from 'js-cookie';
import { tokenHelper } from '../_helpers';
import jwt from 'jsonwebtoken';

let token = Cookies.get('__session');
const initialState = token ? { loggedIn: true, token } : {};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user,
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user,
            };
        case userConstants.LOGIN_FAILURE:
            return {};
        case userConstants.LOGOUT:
            return {};
        default:
            if (token) {
                state.user = jwt.verify(token, '1234567890abcdef');
            }
            return state
    }
}