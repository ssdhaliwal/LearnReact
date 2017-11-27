import React from 'react';

class Title extends React.Component {
    constructor(props) {
        super(props);

        // store the state
        this.state = {
            title: this.props.title
        };
    }

    render() {
        return (
            <div className={"col-xs-9 margin-zero"}>
                <h2>
                    <label className={this.props.className}>
                        {this.state.title}
                    </label>
                </h2>
            </div>
        )
    }
}

// ========================================

export default Title;
