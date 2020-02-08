import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {userActions} from '../../_actions';
import styled, {css} from 'styled-components';
import {Scrollbars} from 'react-custom-scrollbars';
import _concat from 'lodash/concat';
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import {
    TableTemplate,
    Anchor,
    TableWrapper,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    TableRow
} from '../_shared';

const StyledTableRow = styled(TableRow)`
    &:hover {
        background-color: #e6f4fc;
    }
`;

const ExpandedRowStyle = styled.div`
    padding: 16px 16px 16px 52px;
    border-bottom: 1px solid #ddd;
    &:last-child {
        border-bottom-width: 0;
    }
`;

const ExpandIcon = styled.div`
    cursor: pointer;
    display: inline-block;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    border: 1px solid #e9e9e9;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
        user-select: none;
    background: #fff;

    ${props => props.expanded && css`
        :after {
            content: '-';
        }
    `}
    ${props => !props.expanded && css`
        :after {
            content: '+';
        }
    `}
`;

const subColumns = [
    {title: 'Role Name', dataKey: 'name'},
    {title: 'Services', dataKey: 'services', render: (value, row) => value.join(',')},
    {title: 'Modules', dataKey: 'modules', render: (value, row) => value.join(',')},
];

class UserManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expandedRowKeys: [],
        }
    }

    handleExpandedRowRender = (record, key) => {
        return (
            <Fragment>
                <div>Role Detail</div>
                <TableTemplate
                    minimalist
                    columns={subColumns}
                    data={record.roles}
                    height={150}
                    width={600}
                />
            </Fragment>
        );
    };

    handleToggleDetails = (record) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {expandedRowKeys} = this.state;
        const isIdInSelectedList = _includes(expandedRowKeys, record.name);
        const newExpandedRowList = isIdInSelectedList
            ? _filter(expandedRowKeys, id => id !== record.name)
            : _concat(expandedRowKeys, record.name);

        this.setState({expandedRowKeys: newExpandedRowList});
    };

    handleRenderActionColumn = (text, record) => {
        const {expandedRowKeys} = this.state;
        const expanded = (expandedRowKeys.indexOf(record.name) >= 0);
        return (
            <Anchor onClick={this.handleToggleDetails(record)}>
                <ExpandIcon expanded={expanded}/>
            </Anchor>
        );
    };

    componentDidMount() {
        this.props.getUsers();
    }

    render() {
        const {users} = this.props;
        const columns = [
            {dataKey: 'name', render: this.handleRenderActionColumn, width: 40},
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
            {
                title: 'Updated at',
                dataKey: 'updatedAt',
            },
            {
                title: 'Created at',
                dataKey: 'createdAt',
            }
        ];

        return (
            <div>
                <h1 className="text-primary">User Management</h1>
                <TableWrapper
                    hoverable
                    columns={columns}
                    data={users.items}
                    width={800}
                    height={800}
                    emptyRender={() => users.error && <span className="text-danger">ERROR: {users.error}</span>}
                    loaderRender={() => users.loading}
                >
                    {({cells, data, tableWidth}) => {
                        return (
                            <Fragment>
                                <TableHeader>
                                    <TableRow>
                                        {
                                            cells.map((cell, index) => {
                                                const key = `table_header_cell_${index}`;
                                                const {
                                                    title,
                                                    width: cellWidth,
                                                } = cell;
                                                return (
                                                    <TableHeaderCell
                                                        key={key}
                                                        width={cellWidth}
                                                    >
                                                        {title}
                                                    </TableHeaderCell>
                                                );
                                            })
                                        }
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <Scrollbars
                                        style={{
                                            width: tableWidth
                                        }}
                                    >
                                        {
                                            data.map((row, index) => {
                                                const rowKey = `table_row${index}`;
                                                const isExpanded = _includes(this.state.expandedRowKeys, row.name);
                                                return (
                                                    <Fragment key={rowKey}>
                                                        <StyledTableRow>
                                                            {
                                                                cells.map((cell, index) => {
                                                                    const key = `${rowKey}_cell${index}`;
                                                                    const cellValue = _get(row, cell.dataKey);
                                                                    return (
                                                                        <TableCell
                                                                            key={key}
                                                                            width={cell.width}
                                                                        >
                                                                            {typeof cell.render === 'function' ? cell.render(cellValue, row, index) : cellValue}
                                                                        </TableCell>
                                                                    );
                                                                })
                                                            }
                                                        </StyledTableRow>
                                                        {isExpanded && (
                                                            <ExpandedRowStyle>
                                                                {this.handleExpandedRowRender(row, index)}
                                                            </ExpandedRowStyle>
                                                        )}
                                                    </Fragment>
                                                );
                                            })
                                        }
                                    </Scrollbars>
                                </TableBody>
                            </Fragment>
                        );
                    }}
                </TableWrapper>
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
