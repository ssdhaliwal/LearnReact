import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      // create button and link the onClick/value to the passed values
      // from the Board component
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  };
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    // store the current state of the square and boolean for X/O
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };

    // register local callbacks with the parent component
    this.registerCallbacks();
  }

  // restore the current state to the selected move
  // executed when parent requests update
  jumpTo(message) {
    // update the history by cutting unwanted items
    // note updating this will not redraw because it did not change
    // the state of the parent - we have to send this back to parent
    message.history = message.history.slice(0, message.move + 1);

    // store the current to update local state and re-render
    const current = message.history[message.move];

    // update local state which will force redraw
    this.setState({
      squares: current.squares.slice(),
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
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  }

  // hangles the click event registered by the Square component
  handleClick(i) {
    // creates a local copy of the current state of squares
    const squares = this.state.squares.slice();

    // if already a winner, no update - return
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }

    // update the state of the square
    squares[i] = (this.state.xIsNext ? 'X' : 'O');

    // store the state - which causes redraw of that specific square
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });

    // notify the parent of change
    this.props.saveMove({
      "action": "add",
      "squares": squares
    });
  }

  // call to draw the square based on the value stored in state
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    // update the display to show board status
    const winner = this.calculateWinner(this.state.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    // store the status of the game - history and available callbacks
    this.state = {
      history: [{
        squares: Array(9).fill(null)
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

  render() {
    // creates the layout for the game status and available items
    // for restore based on current history
    const moves = this.state.history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // note .bind(this) - need to ensure the functions passed to child
    // are executed in the current component context
    return (
      <div className="game">
        <div className="game-board">
          <Board saveMove={this.saveMove.bind(this)}
            registerCallbacks={this.registerCallbacks.bind(this)} />
        </div>
        <div className="game-info">
          <div>Moves: {this.state.history.length - 1}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
