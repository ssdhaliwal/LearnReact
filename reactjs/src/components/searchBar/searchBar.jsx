import React from 'react';
import SearchButton from './searchButton.jsx';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        // store the state
        this.state = {
            layout: this.props.layout,
            spacing: this.props.spacing,
            onChange: this.props.onChange,
            selected: "",
            space1: ["$","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            space3: ["$_#","ABC","DEF","GHI","JKL","MNO","PQR","STU","VWX","YX"]
        };

        // register local callbacks with the parent component
        this.registerCallbacks();
    }

    // register the functions which we want parent to be able to call
    // notice the .bind(this) - these functions should be executed in
    // the cotext of this component.
    registerCallbacks() {
        // create object of callbacks to register
        let callbacks = {
            clearSearch: this.clearSearch.bind(this)
        }

        // notify the parent about the provided callbacks available
        this.props.registerCallbacks(callbacks);
    }

    clearSearch() {
        console.log("search: clearSearch()");
    }

    onChange(event) {
        let text = "";
        if (this.state.selected === event.text) {
        } else {
            text = event.text
        }

        this.setState({
            selected: text
        });
    
        if (this.state.onChange) {
            this.state.onChange({
                "type": "search",
                "text": text
            });
        }
    }

    renderButtons() {
        let html = [];

        if (this.state.spacing === "group") {
            this.state.space3.map((value, idx) => {
                html.push(<SearchButton 
                    key={"sbg"+idx} 
                    onChange={this.onChange.bind(this)}
                    text={value}
                    layout={this.state.layout}
                    selected={this.state.selected} />);
            });
        } else {
            this.state.space1.map((value, idx) => {
                html.push(<SearchButton 
                    key={"sbg"+idx} 
                    onChange={this.onChange.bind(this)}
                    text={value}
                    layout={this.state.layout}
                    selected={this.state.selected} />);
            });
        }

        return (
            html
        )
    }

    render() {
        let className = 
            (this.state.layout === "vertical") ? "col-xs-1 text-center margin-zero" : "navbar-right text-center margin-zero";

        return (
            <div className={className}>
                {this.renderButtons()}
            </div>
        )
    }
}

// ========================================

export default SearchBar;
