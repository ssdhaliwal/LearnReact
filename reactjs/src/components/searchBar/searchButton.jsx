import React from 'react';

class SearchButton extends React.Component {
    constructor(props) {
        super(props);

        // store the state
        this.state = {
            layout: this.props.layout,
            onChange: this.props.onChange,
            selected: ""
        };
    }

    onClick(e) {
        if (this.state.onChange) {
            this.state.onChange({
                "type": "click",
                "text": e.target.innerText
            });
        }
    }

    render() {
        let className = "btn btn-default btn-xs";
        
        if (this.props.text === this.props.selected) {
            className = "btn btn-primary btn-xs";
        }

        className += " btn-width";

        return (
            <button className={className} 
                onClick={(e) => { this.onClick(e) }}>
                {this.props.text}
            </button>
        )
    }
}

// ========================================

export default SearchButton;
