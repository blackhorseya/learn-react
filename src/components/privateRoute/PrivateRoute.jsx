import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from "../../_helpers";

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        let token = getToken();

        var containRoles = function(ele) {
            return true;
            // return user.roles.includes(ele);
        }

        if (!token){
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        if (roles && !roles.some(containRoles)) {
            return <Redirect to={{ pathname: '/'}} />
        }

        return <Component {...props} />
    }} />
)