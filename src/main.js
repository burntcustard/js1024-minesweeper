/**
 * bombs are represented by the number 9
 * `+variable` is used instead of `parseInt(variable)` to save a few bytes
 */

const w = 9;
const h = 9;
const numBombs = 10;
const controls = document.createElement('div');
const flagCountElement = document.createElement('div');
const restartButton = document.createElement('button');
const m = document.createElement('div'); // "map" or "game map element"

const start = () => {
  flagCountElement.innerText = '🚩'.repeat(numBombs);
  restartButton.innerText = '🙂';
  m.innerText = '';

  for (let i = 0; i < w * h; i++) {
    const button = document.createElement('button');
    button.onclick = (e) => revealCell(i % w, ~~(i / w), 1); // Saves 1B by including the e variable
    button.oncontextmenu = (e) => e.preventDefault() & flagCell(button);
    // "value" that we give each button. Is the number of adjacent bombs (or 9+ if there's a bomb)
    button.v = 0;
    m.append(button);
  }

  const addBomb = () => {
    const randomIndex = ~~(Math.random() * w * h); // ~~ as Math.floor() for positive numbers

    if (m.children[randomIndex].v) {
      addBomb();
    } else {
      m.children[randomIndex].v = 9;
    }
  }

  // Reverse loop saves a few b, but isn't suitable for other loops as it confusingly reverses x/y
  for (let b = numBombs; b--;) {
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

  for (let i = 0; i < w * h; i++) {
    m.children[i].style.cssText = `
      font-weight: 600;
      color: hwb(${230 * m.children[i].v} 0% 40%);
    `;
  }
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
  // If there's already a flag on it
  if (button.innerText) {
    // Remove the flag from the button
    button.innerText = '';
    // Add the flag back into the flag-storage
    flagCountElement.innerText += '🚩';
  // If there's not a flag on it, and there's still at least some flags in the flag-storage
  } else if (flagCountElement.innerText) {
    // Add the flag to the button
    button.innerText = '🚩';
    // Remove a single flag from the flag storage
    flagCountElement.innerText = flagCountElement.innerText.replace('🚩', '');
    // We might have just won!
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

  // If it's a bomb
  if (button.v > 8 && initial) {
    // Reveal all the bombs and disable all the buttons
    for (let i = 0; i < w * h; i++) {
      if (m.children[i].v > 8) {
        m.children[i].innerText = '💣';
      }

      m.children[i].disabled = true;
    }

    restartButton.innerText = '😵';

    // Overrides the bomb with the explosion on the button you clicked
    button.innerText = '💥';
  }
}

b.style.cssText = `
  margin: 0;
`;
controls.style.cssText = `
  margin: 1em;
  max-width: 4in;
  display: flex;
`;
restartButton.style.cssText = `
  margin-left: auto;
  font-size: 3em;
  aspect-ratio: 1;
`;
m.style.cssText = `
  margin: 1em;
  max-width: 4in;
  display: grid;
  aspect-ratio: ${w/h};
  grid: repeat(${h},1fr)/repeat(${w},1fr);
`;
restartButton.onclick = start;
controls.append(flagCountElement, restartButton);
b.append(controls, m);
start();
