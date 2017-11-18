import React from 'react';
import './game.css';
import Board from './board.jsx';

class Game extends React.Component {
    constructor(props) {
        super(props);

        // store the status of the game - history and available callbacks
        this.state = {
            gridSize: this.props.gridSize,
            history: [{
                squares: Array(this.props.gridSize * this.props.gridSize).fill(null)
            }],
            callbacks: {}
        };
    }

    // child calls this to notify that it is registering callbacks
    registerCallbacks(callbacks) {
        // store the callbacks in state
        this.setState({
            callbacks: callbacks
        });
    }

    // send user request for restore to previous game which is forwarded
    // to the registered callback from child
    jumpTo(move) {
        // passes the # of the move to restore and current history collection
        this.state.callbacks.callbackJumpTo({
            "move": move,
            "history": this.state.history
        });
    }

    // received from child when there is a change; add means a new move and
    // "restore" means over-write
    saveMove(message) {
        // if add; add the new move to the history and redraw available moves
        // to restore
        if (message.action === "add") {
            this.setState({
                history: this.state.history.concat([{
                    squares: message.squares
                }])
            });
        } else { // if restore; just replace the history with new state
            this.setState({
                history: message.history
            });
        }
    }

    // change event for the input field
    handleChange(event) {
        let size = event.target.value;

        this.setState({
            gridSize: size,
            history: [{
                squares: Array(size * size).fill(null)
            }]
        });

        // passes the # of the move to restore and current history collection
        this.state.callbacks.callbackJumpTo({
            "history": this.state.history,
            "gridSize": size
        });
    }

    render() {
        // creates the layout for the game status and available items
        // for restore based on current history
        const moves = this.state.history.map((step, idx) => {
            const desc = idx ?
                'Go to move #' + idx :
                'Go to game start';

            return (
                <li key={idx}>
                    <button onClick={() => this.jumpTo(idx)}>{desc}</button>
                </li>
            );
        });

        // note .bind(this) - need to ensure the functions passed to child
        // are executed in the current component context
        return (
            <div>
                <div className="game">
                    <div className="game-board">
                        <Board gridSize={this.state.gridSize} saveMove={this.saveMove.bind(this)}
                            registerCallbacks={this.registerCallbacks.bind(this)} />
                    </div>
                    <div className="game-info">
                        <div>Moves: {this.state.history.length - 1}</div>
                        <ol>{moves}</ol>
                    </div>
                </div>
                <div className="game-settings">
                        <hr />
                        GameSize: <input id="gridSize" className="lineinput"
                            value={this.state.gridSize}
                            onChange={(e) => { this.handleChange(e) }} />
                    </div>
            </div>
        )
    }
}

// ========================================

export default Game;
