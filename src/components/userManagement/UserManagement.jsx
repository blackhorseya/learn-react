import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
import { Table, TablePagination, Button, Anchor } from '../_shared';

class UserManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {
                    sortable: true,
                    title: 'Name',
                    key: 'name',
                    render: (value, row) => {
                        return (<Anchor>{row.name}</Anchor>);
                    }
                },
                {
                    sortable: true,
                    dataIndex: 'roles',
                    title: 'Roles',
                    key: 'roles',
                    render: (value, row) => {
                        return (row.roles.join(','))
                    }
                },
            ]
        }
    }

    componentDidMount() {
        this.props.getUsers();
    }

    render() {
        const { users } = this.props;
        const { columns } = this.state;

        return (
            <div>
                <h1 className="text-primary">User Management</h1>
                <Table
                    bordered
                    hoverable
                    loading={users.loading}
                    rowKey={record => record.id}
                    columns={columns}
                    data={users.items}
                    emptyText={() => users.error && <span className="text-danger">ERROR: {users.error}</span>}
                />
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
