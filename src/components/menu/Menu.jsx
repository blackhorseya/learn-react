import React from 'react';
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
        const { selected, expanded } = this.state;

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
                </SideNav.Nav>
            </SideNav>
        )
    }
}

export { Menu };