import { useState, useEffect, useCallback } from "react";
import "./Game2048.css";

const Game2048 = () => {
  // Game state
  const [grid, setGrid] = useState(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Initialize empty grid
  function createEmptyGrid() {
    return Array(4).fill().map(() => Array(4).fill(0));
  }

  // Add random tile (2 or 4)
  const addRandomTile = useCallback((grid) => {
    const emptyCells = [];
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) emptyCells.push([i, j]);
      });
    });

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
    return grid;
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, [addRandomTile]);

  // Check game over
  const checkGameOver = useCallback((grid) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return false;
        if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
        if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  }, []);

  // Check win condition
  const checkWin = useCallback((grid) => {
    return grid.some(row => row.some(cell => cell === 2048));
  }, []);

  // Move tiles
  const moveTiles = useCallback((direction) => {
    if (gameOver) return;

    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    const processLine = (line) => {
      let filtered = line.filter(val => val !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < 4) filtered.push(0);
      return filtered;
    };

    switch (direction) {
      case 'up':
        for (let j = 0; j < 4; j++) {
          const column = newGrid.map(row => row[j]);
          const newColumn = processLine(column);
          if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
            moved = true;
            newGrid.forEach((row, i) => row[j] = newColumn[i]);
          }
        }
        break;

      case 'down':
        for (let j = 0; j < 4; j++) {
          const column = newGrid.map(row => row[j]).reverse();
          const newColumn = processLine(column).reverse();
          if (JSON.stringify(column) !== JSON.stringify(newColumn.reverse())) {
            moved = true;
            newGrid.forEach((row, i) => row[j] = newColumn[i]);
          }
        }
        break;

      case 'left':
        newGrid.forEach((row, i) => {
          const newRow = processLine([...row]);
          if (JSON.stringify(row) !== JSON.stringify(newRow)) {
            moved = true;
            newGrid[i] = newRow;
          }
        });
        break;

      case 'right':
        newGrid.forEach((row, i) => {
          const newRow = processLine([...row].reverse()).reverse();
          if (JSON.stringify(row) !== JSON.stringify(newRow)) {
            moved = true;
            newGrid[i] = newRow;
          }
        });
        break;
    }

    if (moved) {
      const updatedGrid = addRandomTile(newGrid);
      setGrid(updatedGrid);
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);
      if (checkWin(updatedGrid)) setWon(true);
      if (checkGameOver(updatedGrid)) setGameOver(true);
    }
  }, [grid, score, bestScore, gameOver, addRandomTile, checkGameOver, checkWin]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyActions = {
        'ArrowUp': 'up', 'w': 'up',
        'ArrowDown': 'down', 's': 'down',
        'ArrowLeft': 'left', 'a': 'left',
        'ArrowRight': 'right', 'd': 'right'
      };

      if (keyActions[e.key]) {
        e.preventDefault();
        moveTiles(keyActions[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveTiles]);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Tile styling
  const getTileStyle = (value) => ({
    backgroundColor: getTileColor(value),
    color: value > 4 ? '#f9f6f2' : '#776e65',
    fontSize: value < 100 ? '45px' : value < 1000 ? '40px' : '30px'
  });

  const getTileColor = (value) => {
    const colors = {
      0: '#cdc1b4', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179',
      16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72',
      256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>2048</h1>
        <div className="scores">
          <div className="score-box">
            <div>SCORE</div>
            <div className="score">{score}</div>
          </div>
          <div className="score-box">
            <div>BEST</div>
            <div className="score">{bestScore}</div>
          </div>
        </div>
      </div>

      <div className="game-info">
        <p>Join the numbers to get to <strong>2048!</strong></p>
        <button onClick={startNewGame} className="new-game-btn">New Game</button>
      </div>

      <div className="grid-container">
        <div className="grid-background">
          {Array(16).fill().map((_, i) => <div key={`bg-${i}`} className="grid-cell empty" />)}
        </div>
        <div className="grid-tiles">
          {grid.map((row, i) => (
            row.map((value, j) => (
              value > 0 && (
                <div
                  key={`tile-${i}-${j}`}
                  className="grid-cell tile"
                  style={getTileStyle(value)}
                >
                  {value}
                </div>
              )
            ))
          ))}
        </div>
      </div>

      {(gameOver || won) && (
        <div className="game-overlay">
          <div className="game-message">
            <h2>{won ? 'You Win!' : 'Game Over!'}</h2>
            <button onClick={startNewGame}>
              {won ? 'Keep Going' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;