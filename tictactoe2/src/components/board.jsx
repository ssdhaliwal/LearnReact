import React from 'react';
import './game.css';
import Square from './square.jsx';

class Board extends React.Component {
    constructor(props) {
        super(props);

        // store the current state of the square and boolean for X/O
        this.state = {
            gridSize: this.props.gridSize,
            squares: Array(this.props.gridSize * this.props.gridSize).fill(null),
            winner: null,
            lines: this.calculateLines(this.props.gridSize),
            xIsNext: true
        };

        // register local callbacks with the parent component
        this.registerCallbacks();
    }

    // calculate the line grid for winner comparision dynamically
    calculateLines(gridSize) {
        // set the lines based on the gridSize
        const tLines = [];
        let lCubeRow = [], lCubeCol, lCubeTLBR, lCubeBRLT;

        // create 2d array based on grid row size for the length of the grid
        // to keep track of the grid position (used as index for matching)
        // grid row = gridSize; grid length = (gridSize * gridSize)
        for (let i = 0; i < (gridSize * gridSize); i++) {
            // save offset - if firsttime or until we reach end of grid row
            if ((i === 0) || ((i % gridSize) !== 0)) {
                lCubeRow.push(i);
                continue;
            }

            // save the current row
            tLines.push(lCubeRow);

            // start the new row and save the current position
            lCubeRow = [];
            lCubeRow.push(i);
        }
        // save the last row
        tLines.push(lCubeRow);

        // now calculate the cols and X direction 
        // X direction - top-left to bottom right and top-right to bottom-left
        lCubeCol = [];          // store row for each column
        lCubeTLBR = [];         // store row for X - top-left > bottom-right
        lCubeBRLT = [];         // store row for X - bottom-right > top-left
        let c1 = 0, c2 = gridSize - 1;
        for (let i = 0; i < gridSize; i++) {
            // top-left > bottom-right
            lCubeTLBR.push(tLines[c1][i]);
            c1++;

            // bottom-right > top-left
            lCubeBRLT.push(tLines[c2][i]);
            c2--;

            // for each column save the row
            for (let j = 0; j < gridSize; j++) {
                lCubeCol.push(tLines[j][i]);
            }

            tLines.push(lCubeCol);
            lCubeCol = [];
        }
        // save the X rows
        tLines.push(lCubeTLBR);
        tLines.push(lCubeBRLT);

        // return the new lines based on gridSize
        return tLines;
    }

    // restore the current state to the selected move
    // executed when parent requests update
    jumpTo(message) {
        // check if this is a redraw
        if (message.hasOwnProperty("gridSize")) {
            this.setState({
                gridSize: message.gridSize,
                squares: Array(message.gridSize * message.gridSize).fill(null),
                winner: null,
                lines: this.calculateLines(message.gridSize),
                xIsNext: true
            });

            return;
        }

        // update the history by cutting unwanted items
        // note updating this will not redraw because it did not change
        // the state of the parent - we have to send this back to parent
        message.history = message.history.slice(0, message.move + 1);

        // store the current to update local state and re-render
        const current = message.history[message.move];

        // update local state which will force redraw
        this.setState({
            squares: current.squares.slice(),
            winner: null,
            xIsNext: (message.move % 2) === 0
        });

        // send the update back to the parent so it can update its store
        // and re-render
        this.props.saveMove({
            "action": "replace",
            "history": message.history
        });
    }

    // register the functions which we want parent to be able to call
    // notice the .bind(this) - these functions should be executed in
    // the cotext of this component.
    registerCallbacks() {
        // create object of callbacks to register
        let callbacks = {
            callbackJumpTo: this.jumpTo.bind(this)
        }

        // notify the parent about the provided callbacks available
        this.props.registerCallbacks(callbacks);
    }

    // calculate the winner; moved here - do not like global functions
    calculateWinner(squares) {
        // loop for all lines and compare if one record matches a player (index 0)
        const linesLen = this.state.lines.length;
        for (let i = 0; i < linesLen; i++) {
            const row = this.state.lines[i];

            // if the first index has data, then check rest
            if (squares[row[0]]) {
                let match = 0;

                // loop through all the items in record; exit if any are null
                let rowLen = row.length;
                for (let j = 0; j < rowLen; j++) {
                    if (squares[row[j]] === squares[row[0]]) {
                        match++;
                    } else {
                        break;
                    }
                }

                // if total match = size of grid then we have a winner
                // leave this as == because gridSize is passed as string
                if (match == this.state.gridSize) {
                    return this.state.lines[i];
                }
            }
        }

        // default return
        return null;
    }

    // hangles the click event registered by the Square component
    handleClick(i) {
        // creates a local copy of the current state of squares
        const squares = this.state.squares.slice();

        // if no winner; then process the click
        if (!this.state.winner) {
            // update the state of the square
            squares[i] = (this.state.xIsNext ? 'X' : 'O');

            // if already a winner, no update - return
            const winner = this.calculateWinner(squares);

            // store the state - which causes redraw of that specific square
            this.setState({
                squares: squares,
                winner: winner,
                xIsNext: !this.state.xIsNext
            });

            // notify the parent of change
            this.props.saveMove({
                "action": "add",
                "squares": squares
            });
        }
    }

    // call to draw the square based on the value stored in state
    renderSquare(i) {
        // update class for winning match
        let className = "square";

        if ((this.state.winner) &&
            (this.state.winner.indexOf(i) >= 0)) {
            className += " square-win";
        }

        return (
            <Square key={"square" + i} className={className}
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    // renders the grid based on gridSize
    renderGrid() {
        let grid = [], gridRow, gridOut;
        let size = this.state.gridSize;

        // create a local copy of the current squares
        let squares = this.state.squares.slice();

        // index used to track total squares since we are breaking them down
        // one record/line at a time
        let index = 0;

        // loop through all the squares one row at a time
        for (let row = 0; row < size; row++) {
            // extract one row from the squares array
            gridRow = squares.splice(0, size);

            // using map; process each square and render the grid
            // note: binding to this for the map
            gridRow.map(function (d, idx) {
                // if firsttime or at row break initialize the array
                if ((index === 0) || ((index % size) === 0)) {
                    gridOut = [];
                }

                // create each square based on index and store it in array
                gridOut.push(this.renderSquare(index));

                // if we are at the last position before the break
                // store the row/line and insert BR
                if ((index > 0) && ((index % size) === (size - 1))) {
                    grid.push(gridOut);
                    grid.push(<br key={"br" + index} />);
                }

                // update the index
                index++;
            }, this);
        }

        return (
            grid
        )
    }

    render() {
        // update the display to show board status
        const winner = this.state.winner;

        // based on winner; update the div
        let status;
        if (winner) {
            status = 'Winner: ' + this.state.squares[winner[0]];
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        // create the grid dynamically
        const grid = this.renderGrid();

        return (
            <div>
                <div className="status">{status}</div>
                {grid}
            </div>
        );
    }
}

// ========================================

export default Board;
