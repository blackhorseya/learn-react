import React from 'react';
import {connect} from 'react-redux';
import {userActions} from '../../_actions';
import {TableTemplate, Anchor} from '../_shared';

class UserManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {
                    title: 'Name',
                    dataKey: 'name',
                    width: '20%',
                },
                {
                    title: 'Roles',
                    dataKey: 'roles',
                    render: (value, row) => {
                        return (value.map(role => role.name).join(','));
                    }
                },
            ]
        }
    }

    componentDidMount() {
        this.props.getUsers();
    }

    render() {
        const {users} = this.props;
        const {columns} = this.state;

        return (
            <div>
                <h1 className="text-primary">User Management</h1>
                <TableTemplate
                    hoverable
                    width={800}
                    loading={users.loading}
                    columns={columns}
                    data={users.items}
                    emptyRender={() => users.error && <span className="text-danger">ERROR: {users.error}</span>}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {users, authentication} = state;
    const {user} = authentication;
    return {user, users};
}

const actionCreators = {
    getUsers: userActions.getAll,
};

const connectedUserManagement = connect(mapStateToProps, actionCreators)(UserManagement);
export {connectedUserManagement as UserManagement};
