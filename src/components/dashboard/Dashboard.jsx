import React from 'react'
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

class Dashboard extends React.Component {
    render() {
        const { user } = this.props;

        let roleTable = null;
        if (!Array.isArray(user.role)) {
            roleTable = (
                <li key='1'>
                    {user.role}
                </li>
            );
        } else {
            roleTable = (
                user.role.map((role, index) =>
                    <li key={index}>
                        {role}
                    </li>
                )
            )
        }

        return (
            <div>
                <h1 className="text-primary">Dashboard</h1>
                {
                    user &&
                    <h2>Hi {user.unique_name}!</h2>
                }
                {
                    user && user.role &&
                    <ul>
                        {roleTable}
                    </ul>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.authentication;
    return { user };
}

const actionCreators = {
    getUsers: userActions.getById,
}

const connectedDashboard = connect(mapStateToProps, actionCreators)(Dashboard);
export { connectedDashboard as Dashboard };