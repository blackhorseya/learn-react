import React from 'react'
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

class Dashboard extends React.Component {
    render() {
        const { user } = this.props;

        return (
            <div>
                <h1 className="text-primary">Dashboard</h1>
                <h2>Hi {user && user.name}!</h2>
                {user && user.roles &&
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
    const { user } = state.authentication;
    return { user };
}

const actionCreators = {
    getUsers: userActions.getById,
}

const connectedDashboard = connect(mapStateToProps, actionCreators)(Dashboard);
export { connectedDashboard as Dashboard };