import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import uncontrollable from 'uncontrollable';
import { DatePicker, TimeInput, DateInput } from '.';
import './DateTimeRangePicker.css';

class DateTimeRangePicker extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        minDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        maxDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        startDate: PropTypes.string,
        startTime: PropTypes.string,
        endDate: PropTypes.string,
        endTime: PropTypes.string,
        onChangeStartDate: PropTypes.func,
        onChangeStartTime: PropTypes.func,
        onChangeEndDate: PropTypes.func,
        onChangeEndTime: PropTypes.func
    };

    render() {
        const {
            locale,
            minDate,
            maxDate,
            startDate,
            startTime,
            endDate,
            endTime,
            onChangeStartDate,
            onChangeStartTime,
            onChangeEndDate,
            onChangeEndTime
        } = this.props;

        return (
            <div className="date-picker-pane">
                <div className="date-picker-pane-header">
                    <div className="input-icon-group">
                        <DateInput
                            value={startDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={onChangeStartDate}
                        />
                    </div>
                    <div className="input-icon-group">
                        <TimeInput
                            value={startTime}
                            onChange={onChangeStartTime}
                        />
                    </div>
                    <div className="tilde">~</div>
                    <div className="input-icon-group">
                        <DateInput
                            value={endDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={onChangeEndDate}
                        />
                    </div>
                    <div className="input-icon-group">
                        <TimeInput
                            value={endTime}
                            onChange={onChangeEndTime}
                        />
                    </div>
                </div>
                <div className="date-picker-pane-body">
                    <div className="date-picker-pane-container">
                        <DatePicker
                            locale={locale}
                            date={startDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            onSelect={onChangeStartDate}
                        />
                    </div>
                    <div className="date-picker-pane-container">
                        <DatePicker
                            locale={locale}
                            date={endDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            onSelect={onChangeEndDate}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const uncontrollableDateTimeRangePicker = uncontrollable(DateTimeRangePicker, {
    startDate: 'onChangeStartDate',
    startTime: 'onChangeStartTime',
    endDate: 'onChangeEndDate',
    endTime: 'onChangeEndTime'
});

export { uncontrollableDateTimeRangePicker as DateTimeRangePicker };