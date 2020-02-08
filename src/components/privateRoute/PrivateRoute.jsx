import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { tokenHelper } from "../../_helpers";

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        let token = tokenHelper.getToken();
        let user = token ? tokenHelper.verifyToken(token) : null;

        var containRoles = function (ele) {
            return user.role.includes(ele);
        };

        if (!token) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        if (roles && !roles.some(containRoles)) {
            return <Redirect to={{ pathname: '/' }} />
        }

        return <Component {...props} />
    }} />
);