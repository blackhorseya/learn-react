import React from 'react';
import { connect } from 'react-redux';
import FormControl, { Input } from '@trendmicro/react-form-control';
import { Button } from '@trendmicro/react-buttons';
import styled from 'styled-components';

import '@trendmicro/react-form-control/dist/react-form-control.css';
import '@trendmicro/react-buttons/dist/react-buttons.css';

import { userActions } from '../../_actions';

const FormGroup = styled.div`
    margin-bottom: 12px;
`;

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        if (username && password) {
            this.props.login(username, password);
        }
    }
    render() {
        const { username, password, submitted } = this.state;

        return (
            <div className="col-md-4 col-md-offset-4">
                <h1 className="text-primary">Login</h1>
                <form name="form" onSubmit={this.handleSubmit}>
                    <FormControl lg>
                        <FormGroup className={(submitted && !username ? ' has-error' : '')}>
                            <Input lg type="text" className="form-control" name="username" value={username} onChange={this.handleChange} placeholder="Username" />
                            {submitted && !username &&
                                <div className="help-block">Username is required</div>
                            }
                        </FormGroup>
                        <FormGroup className={(submitted && !password ? ' has-error' : '')}>
                            <Input lg type="password" className="form-control" name="password" value={password} onChange={this.handleChange} placeholder="Password" />
                            {submitted && !password &&
                                <div className="help-block">Password is required</div>
                            }
                        </FormGroup>
                        <FormGroup>
                            <Button type="submit" btnSize="lg" btnStyle="emphasis" block>Login</Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
}

const actionCreators = {
    login: userActions.login,
    // logout: userActions.logout
};

const connectedLogin = connect(mapStateToProps, actionCreators)(Login);
export { connectedLogin as Login };