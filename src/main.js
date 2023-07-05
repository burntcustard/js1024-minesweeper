/**
 * bombs are represented by the number 9
 * `+variable` is used instead of `parseInt(variable)` to save a few bytes
 */

const w = 9;
const h = 9;
const numBombs = 10;
const flagCountElement = document.createElement('div');
const restartButton = document.createElement('button');
const m = document.createElement('div'); // "map" or "game map element"

const start = () => {
  flagCountElement.innerText = '🚩'.repeat(numBombs);
  restartButton.innerText = '🙂';
  m.innerText = '';

  for (let i = 0; i < w * h; i++) {
    const button = document.createElement('button');
    button.onclick = () => revealCell(i % w, ~~(i / w), 1);
    button.oncontextmenu = (e) => e.preventDefault() & flagCell(button);
    // "value" that we give each button, which is the number of adjacent bombs (or 9+ if there's a bomb)
    button.v = 0;
    m.append(button);
  }

  const addBomb = () => {
    const randomIndex = ~~(Math.random() * w * h); // ~~ as Math.floor() for +numbers

    if (m.children[randomIndex].v) {
      addBomb();
    } else {
      m.children[randomIndex].v = 9;
    }
  }

  for (let b = 0; b < numBombs; b++) {
    addBomb();
  }

  // Test separate (simpler?) x and y for figuring out adjacent cell values
  // for (let x = 0; x < w; x++) {
  //   for (let y = 0; y < h; y++) {
  //     x && y && m.children[x - 1 + (y - 1) * w].v > 8 && m.children[x + y * w].v++;                 // -1,-1
  //     y && m.children[x + (y - 1) * w].v > 8 && m.children[x + y * w].v++;                          //  0,-1
  //     x < w - 1 && y && m.children[x + 1 + (y - 1) * w].v > 8 && m.children[x + y * w].v++;             // +1,-1
  //     x && m.children[x - 1 + y * w].v > 8 && m.children[x + y * w].v++;                            // -1, 0
  //     //                                                                                        //  0, 0
  //     x < w - 1 && m.children[x + 1 + y * w].v > 8 && m.children[x + y * w].v++;                    // +1, 0
  //     x && y < h - 1 && m.children[x - 1 + (y + 1) * w].v > 8 && m.children[x + y * w].v++;         // -1,+1
  //     y < h - 1 && m.children[x + (y + 1) * w].v > 8 && m.children[x + y * w].v++;                  //  0,+1
  //     x < w - 1 && y < h - 1 && m.children[x + 1 + (y + 1) * w].v > 8 && m.children[x + y * w].v++; // +1,+1
  //   }
  // }

  for (let i = 0; i < w * h; i++) {                                                                         //  x, y
    i % w && i >= w && m.children[i % w - 1 + (~~(i / w) - 1) * w].v > 8 && m.children[i].v++;              // -1,-1
    i >= w && m.children[i % w + (~~(i / w) - 1) * w].v > 8 && m.children[i].v++;                           //  0,-1
    (i + 1) % w && i >= w && m.children[i % w + 1 + (~~(i / w) - 1) * w].v > 8 && m.children[i].v++;        // +1,-1
    i % w && m.children[i % w - 1 + ~~(i / w) * w].v > 8 && m.children[i].v++;                              // -1, 0
                                                                                                            //  0, 0
    (i + 1) % w && m.children[i % w + 1 + ~~(i / w) * w].v > 8 && m.children[i].v++;                        // +1, 0
    i % w && i + w < w * h && m.children[i % w - 1 + (~~(i / w) + 1) * w].v > 8 && m.children[i].v++;       // -1,+1
    i + w < w * h && m.children[i % w + (~~(i / w) + 1) * w].v > 8 && m.children[i].v++                     //  0,+1
    (i + 1) % w && i + w < w * h && m.children[i % w + 1 + (~~(i / w) + 1) * w].v > 8 && m.children[i].v++; // +1,+1
  }
}

const lose = () => {
  for (let i = 0; i < w * h; i++) {
    if (m.children[i].v > 8) {
      m.children[i].innerText = '💣';
    }

    m.children[i].disabled = true;
  }

  restartButton.innerText = '😵';
}

const checkIfWon = () => {
  for (let i = 0; i < w * h; i++) {
    // If it's a bomb without a flag, or a not-bomb that's not disabled
    if ((m.children[i].v > 8 && m.children[i].innerText !== '🚩') || (m.children[i].v < 9 && !m.children[i].disabled)) {
      return;
    }
  }

  restartButton.innerText = '🤩';

  for (let i = 0; i < w * h; i++) {
    m.children[i].disabled = true;
  }
}

const flagCell = (button) => {
  if (button.innerText) {
    button.innerText = '';
    flagCountElement.innerText += '🚩'; // Add a 🚩
  } else if (flagCountElement.innerText) {
    button.innerText = '🚩';
    flagCountElement.innerText = flagCountElement.innerText.replace('🚩', ''); // Remove a 🚩
    checkIfWon();
  }
}

const revealCell = (x, y, initial) => {
  const button = m.children[y * w + x];
  if (x < 0 || x >= w || y < 0 || y >= h || button.disabled) return;

  if (button.innerText === '🚩') {
    // You can't click on flagged cells!
    if (initial) return;

    flagCountElement.innerText += '🚩';
  }

  button.innerText = button.v || '';
  button.disabled = true;

  // If it's a bomb
  if (button.v > 8) {
    if (initial) {
      // clicked on a bomb you lose
      lose();

      // Overrides the bomb with the explosion on the button you clicked
      button.style.cssText = 'font-size:1pc';
      button.innerText = '💥';
    }
    return;
  }

  checkIfWon();

  // If there's no number at all in this cell then clear (by "clicking") adjacent cells
  if (!button.v) {
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

b.style.cssText = 'max-width:450px;display:flex;flex-wrap:wrap';
m.style.cssText = `width:100%;aspect-ratio:${w/h};display:grid;grid-template:repeat(${h},1fr)/repeat(${w},1fr)`
restartButton.style.cssText = 'font-size:2em;width:2em;aspect-ratio:1;margin-left:auto';
b.append(flagCountElement, restartButton, m);
restartButton.onclick = start;
start();
