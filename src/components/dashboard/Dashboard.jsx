import React from 'react'
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

class Dashboard extends React.Component {
    render() {
        const { user, users } = this.props;

        return (
            <div>
                <h1 className="text-primary">Dashboard</h1>
                <h2>Hi {user.name}!</h2>
                {user.roles &&
                    <ul>
                        {user.roles.map((role, index) =>
                            <li key={index}>
                                {role}
                            </li>
                        )}
                    </ul>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getById,
}

const connectedDashboard = connect(mapStateToProps, actionCreators)(Dashboard);
export { connectedDashboard as Dashboard };