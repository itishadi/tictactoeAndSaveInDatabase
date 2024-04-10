import React, { useState } from 'react';
import './App.css';
import circleIcon from "./assets/circle.png";
import crossIcon from "./assets/cross.png";
import axios from 'axios'; // Importera axios för HTTP-requests

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [firstPlayer, setFirstPlayer] = useState('X'); // Default first player is X

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    calculateWinner(newBoard);
  };

  const calculateWinner = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        saveGameResult(board[a]); // Anropa funktionen för att spara spelets resultat
        return;
      }
    }

    if (board.every(square => square !== null)) {
      setWinner('Draw');
      saveGameResult('Draw'); // Anropa funktionen för att spara spelets resultat
    }
  };

  const saveGameResult = async (result) => {
    const endTime = new Date(); // Hämta slutdatum och tid för spelet
    const timeDiff = endTime - startTime; // Beräkna tidsdifferensen i millisekunder
    const formattedTime = Math.floor(timeDiff / 1000); // Konvertera tiden till sekunder och avrunda

    try {
      await axios.post('http://localhost:3010/saveGameResult', { winner: result, timestamp: formattedTime });
      console.log('Game result saved successfully');
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(firstPlayer === 'X'); // Set first player based on selection
    setStartTime(null); // Återställ starttiden vid återställning av spelet
  };

  const handleFirstPlayerChange = (e) => {
    setFirstPlayer(e.target.value);
    setXIsNext(e.target.value === 'X'); // Set next player immediately when first player changes
  };

  const getTitle = () => {
    if (winner) {
      if (winner === 'Draw') {
        return "It's a Draw!";
      } else {
        return `Winner: ${winner}`;
      }
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="container">
      <h1 className="title">Tic Tac Toe Game In <span>React</span></h1>
      <div className="options">
        <label>
          Choose first player:
          <select value={firstPlayer} onChange={handleFirstPlayerChange}>
            <option value="X">X</option>
            <option value="O">O</option>
          </select>
        </label>
      </div>
      <div className="board">
        <div className="status">{getTitle()}</div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <button className="reset" onClick={resetGame}>Reset</button>
    </div>
  );

  function renderSquare(index) {
    return (
      <button className="square" onClick={() => handleClick(index)}>
        {board[index] === 'X' ? 
          <img src={crossIcon} alt="Cross" className="icon" /> :
          board[index] === 'O' ? 
          <img src={circleIcon} alt="Circle" className="icon" /> : null}
      </button>
    );
  }
};

export default TicTacToe;
