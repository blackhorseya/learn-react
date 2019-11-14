import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        let user = JSON.parse(sessionStorage.getItem('user'));

        var containRoles = function(ele) {
            return user.roles.includes(ele);
        }

        if (!user){
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        if (roles && !roles.some(containRoles)) {
            return <Redirect to={{ pathname: '/'}} />
        }

        return <Component {...props} />
    }} />
)