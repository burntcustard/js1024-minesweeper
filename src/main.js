/**
 * bombs are represented by the number 9
 * `+variable` is used instead of `parseInt(variable)` to save a few bytes
 */

const board = [];
const w = 9;
const h = 9;
const numBombs = 10;
const restartButton = document.createElement('button');
const boardElement = document.createElement('div');
const flagCountElement = document.createElement('div');

boardElement.style.cssText = `width:320px;height:320px;display:grid;grid-template-columns:repeat(${w},1fr)`
restartButton.style.cssText = 'font-size:2em;width:2em;height:2em';
restartButton.onclick = start;
b.append(flagCountElement);
b.append(restartButton);
b.append(boardElement);
start();

function start() {
  flagCountElement.innerText = numBombs;
  restartButton.innerText = '🙂';
  boardElement.innerText = '';

  for (let x = 0; x < w; x++) {
    board[x] = [];
    for (let y = 0; y < h; y++) {
      board[x][y] = 0;
    }
  }

  const addBomb = () => {
    const randomX = ~~(Math.random() * w); // ~~ as Math.floor() for positive numbers
    const randomY = ~~(Math.random() * h); // ~~ as Math.floor() for positive numbers

    if (board[randomX][randomY]) {
      addBomb();
    } else {
      board[randomX][randomY] = 9;
    }
  }

  for (let b = 0; b < numBombs; b++) {
    addBomb();
  }

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      board[x][y] < 9 && board[x - 1]?.[y - 1] > 8 && board[x][y]++
      board[x][y] < 9 && board[x    ]?.[y - 1] > 8 && board[x][y]++
      board[x][y] < 9 && board[x + 1]?.[y - 1] > 8 && board[x][y]++
      board[x][y] < 9 && board[x - 1]?.[y    ] > 8 && board[x][y]++
   // board[x][y] < 9 && board[x    ]?.[y    ] > 8 && board[x][y]++
      board[x][y] < 9 && board[x + 1]?.[y    ] > 8 && board[x][y]++
      board[x][y] < 9 && board[x - 1]?.[y + 1] > 8 && board[x][y]++
      board[x][y] < 9 && board[x    ]?.[y + 1] > 8 && board[x][y]++
      board[x][y] < 9 && board[x + 1]?.[y + 1] > 8 && board[x][y]++

      const button = document.createElement('button');
      button.style.cssText = 'aspect-ratio:1';
      button.onclick = () => revealCell(x, y, 1);
      button.oncontextmenu = (e) => e.preventDefault() & flagCell(button);
      boardElement.append(button);
    }
  }
}

const lose = () => {
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const button = boardElement.children[x * w + y];

      if(board[x][y] > 8) {
        button.innerText = '💣';
      }

      button.disabled = true;
    }
  }

  restartButton.innerText = '😵';
}

const checkIfWon = () => {
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const button = boardElement.children[x * w + y];

      // If it's a bomb without a flag, or a not-bomb that's not disabled
      if ((board[x][y] > 8 && button.innerText !== '🚩') || (board[x][y] < 9 && !button.disabled)) {
        return;
      }
    }
  }

  restartButton.innerText = '🤩';
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const button = boardElement.children[x * w + y];
      button.disabled = true;
    }
  }
}

const flagCell = (button) => {
  if (button.innerText) {
    button.innerText = '';
    flagCountElement.innerText = +flagCountElement.innerText + 1;
    return;
  }

  if (+flagCountElement.innerText) {
    button.innerText = '🚩';
    flagCountElement.innerText = +flagCountElement.innerText - 1;
    checkIfWon();
  }
}

const revealCell = (x, y, initial) => {
  const button = boardElement.children[x * w + y];
  if (x < 0 || x >= w || y < 0 || y >= h || button.disabled) return;

  if (button.innerText === '🚩') {
    // You can't click on flagged cells!
    if (initial) return;

    flagCountElement.innerText = +flagCountElement.innerText + 1;
  }

  button.innerText = board[x][y] || '';
  button.disabled = true;

  // If it's a bomb
  if (board[x][y] > 8) {
    if (initial) {
      // clicked on a bomb you lose
      lose();
    }
    return;
  }

  checkIfWon();

  // If there's no number at all in this cell then clear (by "clicking") adjacent cells
  if (!board[x][y]) {
    // there's nothing in this cell, clear it and any other empty cells around it
    revealCell(x - 1, y - 1);
    revealCell(x    , y - 1);
    revealCell(x + 1, y - 1);
    revealCell(x - 1, y    );
 // revealCell(x    , y    );
    revealCell(x + 1, y    );
    revealCell(x - 1, y + 1);
    revealCell(x    , y + 1);
    revealCell(x + 1, y + 1);
  }
}
