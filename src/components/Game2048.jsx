import React, { useState, useEffect } from "react";

const SIZE = 8;

const getEmptyGrid = () => Array(SIZE).fill().map(() => Array(SIZE).fill(0));
const getRandomInt = (max) => Math.floor(Math.random() * max);

const addRandomTile = (grid) => {
  const emptyTiles = [];
  grid.forEach((row, i) => row.forEach((cell, j) => {
    if (cell === 0) emptyTiles.push([i, j]);
  }));
  if (!emptyTiles.length) return grid;
  const [x, y] = emptyTiles[getRandomInt(emptyTiles.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[x][y] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

const cloneGrid = (grid) => grid.map(row => [...row]);

const slideRow = (row) => {
  const filtered = row.filter(n => n !== 0);
  while (filtered.length < SIZE) filtered.push(0);
  return filtered;
};

const combineRow = (row) => {
  for (let i = 0; i < SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row;
};

const moveLeft = (grid) =>
  grid.map(row => slideRow(combineRow(slideRow(row))));

const moveRight = (grid) =>
  grid.map(row => slideRow(combineRow(slideRow(row.reverse()))).reverse());

const moveUp = (grid) => {
  let newGrid = cloneGrid(grid);
  for (let j = 0; j < SIZE; j++) {
    let col = [];
    for (let i = 0; i < SIZE; i++) col.push(newGrid[i][j]);
    col = slideRow(combineRow(slideRow(col)));
    for (let i = 0; i < SIZE; i++) newGrid[i][j] = col[i];
  }
  return newGrid;
};

const moveDown = (grid) => {
  let newGrid = cloneGrid(grid);
  for (let j = 0; j < SIZE; j++) {
    let col = [];
    for (let i = 0; i < SIZE; i++) col.push(newGrid[i][j]);
    col = slideRow(combineRow(slideRow(col.reverse()))).reverse();
    for (let i = 0; i < SIZE; i++) newGrid[i][j] = col[i];
  }
  return newGrid;
};

export default function Game2048() {
  const [grid, setGrid] = useState(addRandomTile(addRandomTile(getEmptyGrid())));

  const handleKeyDown = (e) => {
    let newGrid;
    if (e.key === "ArrowLeft") newGrid = moveLeft(grid);
    else if (e.key === "ArrowRight") newGrid = moveRight(grid);
    else if (e.key === "ArrowUp") newGrid = moveUp(grid);
    else if (e.key === "ArrowDown") newGrid = moveDown(grid);
    else return;

    if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
      setGrid(addRandomTile(newGrid));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid]);

  return (
    <div className="game-container">
      <h1>2048</h1>
      <div className="grid">
        {grid.flat().map((cell, idx) => (
          <div key={idx} className={`tile ${cell ? `tile-${cell}` : ""}`}>
            {cell !== 0 ? cell : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
