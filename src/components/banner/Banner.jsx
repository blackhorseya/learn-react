import React from 'react'
import './Banner.css';

class Banner extends React.Component {
    render() {
        const { title } = this.props;
        return (
            <header className="site-header">
                <i className="banner" />
                <h1 className="title">{title}</h1>
            </header>
        );
    }
}

export { Banner };