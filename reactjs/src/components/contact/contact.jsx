import React from 'react';
import lodash from 'lodash';
import Title from './pieces/title.jsx';
import Filter from './pieces/filter.jsx';
import List from './pieces/list.jsx';
import SearchBar from '../searchBar/searchBar.jsx';

class Contact extends React.Component {
    constructor(props) {
        super(props);

        // store the status of the game - history and available callbacks
        this.state = {
            data: {},
            callbacks: {}
        };
    }

    // child calls this to notify that it is registering callbacks
    registerCallbacks(callbacks) {
        // store the callbacks in state
        let updatedCallbacks = this.state.callbacks;
        lodash.forIn(callbacks, function(value, key) {
            if (!updatedCallbacks.hasOwnProperty(key)) {
                updatedCallbacks[key] = value;
            }
        });

        this.setState({
            callbacks: updatedCallbacks
        });
    }

    renderTitle(title) {
        return (
            <Title title={title} />
        )
    }

    renderFilter(filtered, total, value) {
        return (
            <Filter filtered={filtered} total={total} 
                value={value} 
                onChange={this.onSearchChange.bind(this)}
                registerCallbacks={this.registerCallbacks.bind(this)} />
        )
    }

    renderListButtons(layout) {
        const list = this.renderList(layout);
        const searchBar = this.renderSearchBar(layout);
        const taxonomy = this.renderSearchBar(layout);
        
        if (layout === "vertical") {
            return (
                <div className={"row margin-zero board-area"}>
                    {list}
                    {searchBar}
                </div>
            )
        } else {
            return (
                <div className={"row margin-zero board-area"}>
                    <div className={"col-xs-12 margin-zero"}>
                        <div className={"row margin-zero"}>
                            {searchBar}
                        </div>
                        <div className={"row margin-zero"}>
                            {list}
                        </div>
                    </div>
                </div>
            )
        }
    }

    renderList(layout) {
        return (
            <List layout={layout} />
        )
    }

    renderSearchBar(layout) {
        return (
            <SearchBar layout={layout} spacing="group" 
                onChange={this.onSearchChange.bind(this)}
                registerCallbacks={this.registerCallbacks.bind(this)} />
        )
    }

    onSearchChange(event) {
        console.log("contact_recv_event: " + JSON.stringify(event));

        if (event.type === "search") {
            if (this.state.callbacks) {
                if (this.state.callbacks.hasOwnProperty("clearFilter")) {
                    this.state.callbacks.clearFilter({
                        "action": "clear"
                    });
                }
            }
        }
    }

    render() {
        // get header render
        const title = this.renderTitle(this.props.title);
        const filter = this.renderFilter(0, 100, "");
        const board = this.renderListButtons("vertical");
        
        // note .bind(this) - need to ensure the functions passed to child
        // are executed in the current component context
        return (
            <div className="container margin-zero">
                <div>
                    <div className={"row margin-zero title-area"}>
                        {title}
                        {filter}
                    </div>
                    {board}
                </div>
                <div className={"row margin-zero"}>
                    <div className={"col-xs-12 margin-zero status-area"}>
                        Test info: <a href="#">seraj dhaliwal</a>
                    </div>
                </div>
            </div>
        )
    }
}

// ========================================

export default Contact;
