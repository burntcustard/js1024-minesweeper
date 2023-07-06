/**
 * bombs are represented by the number 9
 * `+variable` is used instead of `parseInt(variable)` to save a few bytes
 */

const w = 9;
const h = 9;
const numBombs = 10;
const controls = document.createElement('div');
// The <big> element is deprecated but supported in all browsers & makes the flags bigger
const flagCountElement = document.createElement('big');
const restartButton = document.createElement('button');
const m = document.createElement('div'); // "map" or "game map element"

const start = () => {
  flagCountElement.innerHTML = '🚩'.repeat(numBombs);
  restartButton.innerHTML = '🙂';
  m.innerHTML = '';

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

  for (let i = 0; i < w * h; i++) {                                                                         //  x, y
     i      % w && i >= w        && m.children[i % w + w * (~~(i / w) - 1) - 1].v > 8 && m.children[i].v++; // -1,-1
                   i >= w        && m.children[i % w + w * (~~(i / w) - 1)    ].v > 8 && m.children[i].v++; //  0,-1
    (i + 1) % w && i >= w        && m.children[i % w + w * (~~(i / w) - 1) + 1].v > 8 && m.children[i].v++; // +1,-1
     i      % w                  && m.children[i % w + w *  ~~(i / w)      - 1].v > 8 && m.children[i].v++; // -1, 0
    //                                                                                                      //  0, 0
    (i + 1) % w                  && m.children[i % w + w *  ~~(i / w)      + 1].v > 8 && m.children[i].v++; // +1, 0
     i      % w && i + w < w * h && m.children[i % w + w * (~~(i / w) + 1) - 1].v > 8 && m.children[i].v++; // -1,+1
                   i + w < w * h && m.children[i % w + w * (~~(i / w) + 1)    ].v > 8 && m.children[i].v++; //  0,+1
    (i + 1) % w && i + w < w * h && m.children[i % w + w * (~~(i / w) + 1) + 1].v > 8 && m.children[i].v++; // +1,+1
  }

  for (let i = 0; i < w * h; i++) {
    m.children[i].style.cssText = `
      color: lch(45 99 ${m.children[i].v ** 1.1 * 225});
    `;
  }
}

const checkIfWon = () => {
  for (let i = 0; i < w * h; i++) {
    if (
      (m.children[i].v > 8 && m.children[i].innerHTML !== '🚩') || // Bomb without a flag
      (m.children[i].v < 9 && !m.children[i].disabled) // Not-a-bomb that's not yet been clicked
    ) {
      return; // Haven't won
    }
  }

  restartButton.innerHTML = '🤩';

  for (let i = 0; i < w * h; i++) {
    m.children[i].disabled = true;
  }
}

const flagCell = (button) => {
  // If there's already a flag on it
  if (button.innerHTML) {
    // Remove the flag from the button
    button.innerHTML = '';
    // Add the flag back into the flag-storage
    flagCountElement.innerHTML += '🚩';
  // If there's not a flag on it, and there's still at least some flags in the flag-storage
  } else if (flagCountElement.innerHTML) {
    // Add the flag to the button
    button.innerHTML = '🚩';
    // Remove a single flag from the flag storage
    flagCountElement.innerHTML = flagCountElement.innerHTML.replace('🚩', '');
    // We might have just won!
    checkIfWon();
  }
}

const revealCell = (x, y, initial) => {
  const button = m.children[y * w + x];
  if (x < 0 || x >= w || y < 0 || y >= h || button.disabled) return;

  if (button.innerHTML === '🚩') {
    // You can't click on flagged cells!
    if (initial) return;

    // Return the auto-removed flag to the flag-storage
    flagCountElement.innerHTML += '🚩';
  }

  button.innerHTML = '<b>' + (button.v || '');
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
        m.children[i].innerHTML = '💣';
      }

      m.children[i].disabled = true;
    }

    restartButton.innerHTML = '😵';

    // Overrides the bomb with the explosion on the button you clicked
    button.innerHTML = '💥';
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
// font: size font-family shorthand used with invalid font-family to save bytes.
// 'd' is chosen as the invalid font because it appears frequently before `;` in CSS.
// width is // 384/9*1.5=64 so it takes up 1 and a half square with default size.
// width being in rem saves 2B 'cause 4rem = 64px, & it's similar to 'max-width:4in'.
restartButton.style.cssText = `
  margin-left: auto;
  max-width: 4rem;
  font: 1cm d;
  aspect-ratio: 1;
`;
m.style.cssText = `
  margin: 1em;
  max-width: 4in;
  display: grid;
  grid: repeat(${h},1fr)/repeat(${w},1fr);
  aspect-ratio: ${w/h};
`;
restartButton.onclick = start;
controls.append(flagCountElement, restartButton);
b.append(controls, m);
start();

// Color testing
// for (let i = 1; i < 8; i++) {
//   const button = document.createElement('button');
//   // "value" that we give each button. Is the number of adjacent bombs (or 9+ if there's a bomb)
//   button.v = i;
//   m.append(button);
//   button.innerHTML = button.v ? '<b>' + button.v : '';
//   button.style.cssText = `
//     aspect-ratio:1;
//         color: lch(45 99 ${button.v ** 1.1 * 225});
//   `;
// }
