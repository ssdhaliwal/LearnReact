import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  };
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };

    this.registerCallbacks();
  }

  jumpTo(value) {
    value.history = value.history.slice(0, value.move + 1);
    const current = value.history[value.move];

    this.setState({
      squares: current.squares.slice(),
      xIsNext: (value.move % 2) === 0
    });

    this.props.saveMove({
      "action":"replace",
      "history":value.history
    });
  }

  registerCallbacks() {
    let callbacks = {
      callbackJumpTo: this.jumpTo.bind(this)
    }

    this.props.registerCallbacks(callbacks);
  }

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
  
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });

    this.props.saveMove({
      "action":"add",
      "squares":squares
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
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
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      callbacks: {}
    };
  }

  registerCallbacks(callbacks) {
    this.setState({
      callbacks: callbacks
    });  
  }
    
  jumpTo(move) {
    this.state.callbacks.callbackJumpTo({
      "move":move, 
      "history":this.state.history
    });
  }

  saveMove(value) {
    if (value.action === "add") {
      this.setState({
        history: this.state.history.concat([{
          squares: value.squares
        }])
      });
    } else {
      this.setState({
        history: value.history
      });
    }
  }

  render() {
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
