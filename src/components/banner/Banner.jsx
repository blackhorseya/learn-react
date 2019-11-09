import React from 'react'
import { connect } from 'react-redux';
import Anchor from '@trendmicro/react-anchor';
import { Button } from '../buttons';
import { userActions } from '../../_actions';
import { history } from '../../_helpers';
import './Banner.css';

class Banner extends React.Component {
    render() {
        const { title, loggedIn } = this.props;
        return (

            <nav
                className={'navbar navbar-default'}
                style={{ borderRadius: 0 }}
            >
                <div className={'container-fluid'}>
                    <div className={'navbar-header'}>
                        <Anchor className={'navbar-brand'}>{title}</Anchor>
                    </div>
                    <div>
                        {loggedIn &&
                            <Button
                                className={'navbar-btn navbar-right'}
                                btnStyle="flat"
                                onClick={() => {
                                    this.props.logout();
                                    history.push('/');
                                }}
                            >
                                <i className="fa fa-sign-out" />
                                Logout
                        </Button>
                        }
                    </div>
                </div>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    const { loggedIn } = state.authentication;
    return { loggedIn };
}

const actionCreators = {
    logout: userActions.logout,
};

const connectedBanner = connect(mapStateToProps, actionCreators)(Banner);
export { connectedBanner as Banner };