import React from 'react';

class Filter extends React.Component {
    constructor(props) {
        super(props);

        // store the state
        this.state = {
            filtered: this.props.title,
            total: this.props.total,
            value: this.props.value,
            onChange: this.props.onChange,
            defaultValue: "{search string}"
        };

        // fix the text if empty
        if ((!this.state.value) || (this.state.value === "")) {
            this.state.value = this.state.defaultValue;
        }

        // register local callbacks with the parent component
        this.registerCallbacks();
    }

    // register the functions which we want parent to be able to call
    // notice the .bind(this) - these functions should be executed in
    // the cotext of this component.
    registerCallbacks() {
        // create object of callbacks to register
        let callbacks = {
            clearFilter: this.clearFilter.bind(this)
        }

        // notify the parent about the provided callbacks available
        this.props.registerCallbacks(callbacks);
    }

    clearFilter() {
        console.log("filter: clearFilter()");
        this.inputField.value = this.state.defaultValue;
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    onBlur(e) {
        let value = "";

        if (this.inputField.value === "") {
            this.inputField.value = this.state.defaultValue;
        } else {
            value = this.state.value;
        }

        if (this.state.onChange) {
            this.state.onChange({
                "type": "filter",
                "text": value
            });
        }
    }

    render() {
        return (
            <div className={"col-xs-3 margin-zero"}>
                <div className={"row margin-zero"}>
                    <div className={"col-xs-12 margin-zero"}>
                        Status: <label className={"control-label"}>
                            {this.props.filtered}
                        </label> of <label className={"control-label"}>
                            {this.props.total}
                        </label>
                    </div>
                </div>
                <div className={"row margin-zero"}>
                    <div className={"col-xs-12 margin-zero"}>
                        <input type="text" 
                            className={"form-control input-sm"}
                            ref={input => this.inputField = input}
                            defaultValue={this.state.value}
                            onFocus={() => this.inputField.value = ""}
                            onChange={this.onChange.bind(this)}
                            onBlur={this.onBlur.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}

// ========================================

export default Filter;
