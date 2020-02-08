import React from 'react'
import { connect } from 'react-redux';
import moment from 'moment';
import { FormControl, FormGroup, Select, Input, Container, Row, Col, DateTimeRangePicker, Button } from '../_shared';

class Keytool extends React.Component {
    constructor(props) {
        super(props);

        const now = moment();
        this.state = {
            productId: '',
            businessUnit: '22',
            salesType: 'L',
            volume: 30,
            quantity: 1,
            gracePeriod: 1,
            minDate: '2000-01-01',
            maxDate: moment(now).add(2, 'years').format('YYYY-MM-DD'),
            startDate: moment(now).format('YYYY-MM-DD'),
            startTime: moment(now).format('hh:mm:ss'),
            endDate: moment(now).add(7, 'days').format('YYYY-MM-DD'),
            endTime: moment(now).add(7, 'days').format('hh:mm:ss')
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

        console.log(this.state);
    }

    render() {
        const {
            productId,
            businessUnit,
            salesType,
            volume,
            quantity,
            gracePeriod,
            minDate, maxDate,
            startDate, startTime,
            endDate, endTime, } = this.state;

        return (
            <div style={{
                position: 'relative',
                height: 'calc(100vh - 65px)'
            }}>
                <h1 className="text-primary">Keytool page</h1>
                <form name="form" onSubmit={this.handleSubmit}>
                    <FormControl lg>
                        <Container fluid layout="flexbox">
                            <Row>
                                <Col md={3} style={{ marginRight: 10 }}>
                                    <label>Product Id:</label>
                                    <FormGroup>
                                        <Select name="productId" value={productId} onChange={this.handleChange}>
                                            <option>Select One</option>
                                            <option value="1">123</option>
                                            <option value="2">223</option>
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col md={1} style={{ marginRight: 10 }}>
                                    <label>Business Unit:</label>
                                    <FormGroup>
                                        <Select name="businessUnit" value={businessUnit} onChange={this.handleChange}>
                                            <option value="1">01</option>
                                            <option value="22">America</option>
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col md={1} style={{ marginRight: 10 }}>
                                    <FormGroup>
                                        <label>Sales Type:</label>
                                        <Select name="salesType" value={salesType} onChange={this.handleChange}>
                                            <option value="P">P</option>
                                            <option value="L">L</option>
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col md={1} style={{ marginRight: 10 }}>
                                    <FormGroup>
                                        <label>Grace Period:</label>
                                        <Select name="gracePeriod" value={gracePeriod} onChange={this.handleChange}>
                                            <option value="1">30 Days</option>
                                            <option value="2">60 Days</option>
                                            <option value="3">90 Days</option>
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col md={1} style={{ marginRight: 10 }}>
                                    <FormGroup>
                                        <label>Volume:</label>
                                        <Input name="volume" type="number" value={volume} onChange={this.handleChange} min="1" />
                                    </FormGroup>
                                </Col>
                                <Col md={1} style={{ marginRight: 10 }}>
                                    <FormGroup>
                                        <label>Quantity:</label>
                                        <Input name="quantity" type="number" value={quantity} onChange={this.handleChange} min="1" max="10" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col width={4} style={{ marginRight: 10 }}>
                                    <FormGroup>
                                        Start Date and End Date
                                        <DateTimeRangePicker
                                            minDate={minDate}
                                            maxDate={maxDate}
                                            defaultStartDate={startDate}
                                            defaultStartTime={startTime}
                                            defaultEndDate={endDate}
                                            defaultEndTime={endTime}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Button type="submit" btnSize="lg" btnStyle="primary">Generate Key</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Container>
                    </FormControl>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const actionCreators = {

};

const connectedKeyTool = connect(mapStateToProps, actionCreators)(Keytool);
export { connectedKeyTool as Keytool };