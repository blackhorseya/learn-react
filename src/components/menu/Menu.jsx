import React from 'react';
import { connect } from 'react-redux';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.location.pathname.substr(1),
            expanded: false,
        }

        this.onSelect = this.onSelect.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    onSelect = (selected) => {
        this.setState({ selected: selected });
        const to = '/' + selected;
        if (this.props.location.pathname !== to) {
            this.props.history.push(to);
        }
    };

    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    render() {
        const { selected } = this.state;
        const { user } = this.props;

        return (
            <SideNav onSelect={this.onSelect} onToggle={this.onToggle}>
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected={selected}>
                    <NavItem eventKey="dashboard">
                        <NavIcon>
                            <i className="fa fa-fw fa-th-large" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Dashboard
                            </NavText>
                    </NavItem>
                    <NavItem eventKey="keytool">
                        <NavIcon>
                            <i className="fa fa-fw fa-key" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            KeyTool
                            </NavText>
                    </NavItem>
                    { user && user.roles.includes('admin') &&
                        <NavItem eventKey="management">
                            <NavIcon>
                                <i className="fa fa-fw fa-users" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                User Management
                            </NavText>
                        </NavItem>
                    }
                </SideNav.Nav>
            </SideNav>
        )
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    const { user } = authentication;
    return { user }
}

const actionCreators = {

}

const connectedMenu = connect(mapStateToProps, actionCreators)(Menu);
export { connectedMenu as Menu };