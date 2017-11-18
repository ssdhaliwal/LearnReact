import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './components/game.jsx';
// ========================================

ReactDOM.render(
  <Game gridSize={"4"} />,
  document.getElementById('root')
);
