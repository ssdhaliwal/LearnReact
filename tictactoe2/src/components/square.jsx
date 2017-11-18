import React from 'react';
import './game.css';

class Square extends React.Component {
    render() {
        return (
            // create button and link the onClick/value to the passed values
            // from the Board component
            <button className={this.props.className} onClick={() => { this.props.onClick() }}>
                {this.props.value}
            </button>
        );
    };
}

// ========================================

export default Square;
