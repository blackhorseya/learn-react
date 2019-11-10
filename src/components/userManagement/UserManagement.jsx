import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

class UserManagement extends React.Component {
    componentDidMount() {
        this.props.getUsers();
    }

    render() {
        const { users } = this.props;

        return (
            <div>
                <h1 className="text-primary">User Management</h1>
                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                {users.items &&
                    <ul>
                        {users.items.map((user, index) =>
                            <li key={user.id}>
                                {user.name}
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
    getUsers: userActions.getAll,
}

const connectedUserManagement = connect(mapStateToProps, actionCreators)(UserManagement);
export { connectedUserManagement as UserManagement };
