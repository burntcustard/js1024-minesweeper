/**
 * bombs are represented by cells with a number of 9+
 * `+variable` is used instead of `parseInt(variable)` to save a few bytes
 */

// Width and Height are inlined and minified, >9 takes up a lot more bytes
const w = 9;
const h = 9;

// Container element for the flags and the restart button
const controls = document.createElement('p');

// The <big> is deprecated, but supported in all browsers, and makes the flags
// slightly bigger without needing to use 'font-size' CSS
const flagCountElement = document.createElement('big');

// Button used to restart the game and display win condition 🙂/😵/🤩
const restartButton = document.createElement('button');

// Game Map element that contains the buttons
const m = document.createElement('p');

const start = () => {
  // numBombs is decremented when adding bombs, so needs to be reset on start()
  let numBombs = 10;

  // Fill flag storage element with starting flags
  flagCountElement.innerHTML = '🚩'.repeat(numBombs);

  // Set the restart button to it's initial "you're currently playing" state
  restartButton.innerHTML = '🙂';

  // Clear any existing button elements from the game map
  m.innerHTML = '';

  // Create new cells (button elements)
  for (let i = 0; i < w * h; i++) {
    const button = document.createElement('button');

    // Always including 'e' parame saves 1B compared to some with some without
    button.onclick = (e) => revealCell(i % w, ~~(i / w), true);
    button.oncontextmenu = (e) => e.preventDefault() & flagCell(button);

    // Cell Value, i.e. the number of adjacent bombs (9+ if the cell is a bomb)
    button.v = 0;
    m.append(button);
  }

  const addBomb = () => {
    const index = ~~(Math.random() * w * h); // ~~ as Math.floor() for +numbers

    if (m.children[index].v) {
      addBomb();
    } else {
      m.children[index].v = 9;
    }
  }

  // Reverse loop & reusing numBombs var instead of adding a new one saves a
  // few bytes but isn't suitable for other loops as it kind of reverses x/y
  for (; numBombs--;) {
    addBomb();
  }

  // Look at each cells adjacent cells and increment if there's a bomb nearby
  for (let i = 0; i < w * h; i++) {                                                         //  x, y
     i      % w && m.children[i % w + w * (~~(i / w) - 1) - 1]?.v > 8 && m.children[i].v++; // -1,-1
                   m.children[i % w + w * (~~(i / w) - 1)    ]?.v > 8 && m.children[i].v++; //  0,-1
    (i + 1) % w && m.children[i % w + w * (~~(i / w) - 1) + 1]?.v > 8 && m.children[i].v++; // +1,-1
     i      % w && m.children[i % w + w *  ~~(i / w)      - 1]?.v > 8 && m.children[i].v++; // -1, 0
    //                                                                                      //  0, 0
    (i + 1) % w && m.children[i % w + w *  ~~(i / w)      + 1]?.v > 8 && m.children[i].v++; // +1, 0
     i      % w && m.children[i % w + w * (~~(i / w) + 1) - 1]?.v > 8 && m.children[i].v++; // -1,+1
                   m.children[i % w + w * (~~(i / w) + 1)    ]?.v > 8 && m.children[i].v++; //  0,+1
    (i + 1) % w && m.children[i % w + w * (~~(i / w) + 1) + 1]?.v > 8 && m.children[i].v++; // +1,+1
  }

  // Set text color for each cell. Must be done even for bomb cells, as setting
  // a specific color removes Chrome's disabled button text transparency (which
  // even applies to emojis like the bomb)
  for (let i = 0; i < w * h; i++) {
    m.children[i].style.cssText = `
      color: lch(45 99 ${m.children[i].v ** 1.1 * 225});
    `;
  }
}

const checkIfWon = () => {
  for (let i = 0; i < w * h; i++) {
    if (
      // A cell with a bomb, that hasn't been flagged yet:
      (m.children[i].v > 8 && m.children[i].innerHTML !== '🚩') ||
      // A cell without a bomb, that's not been clicked yet:
      (m.children[i].v < 9 && !m.children[i].disabled)
    ) {
      return; // Haven't won!
    }
  }

  // Have won!
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
    // Add the flag back into the flag storage element
    flagCountElement.innerHTML += '🚩';
  // If there's not a flag on it, and there's still >0 flags in flag-storage
  } else if (flagCountElement.innerHTML) {
    // Add the flag to the button
    button.innerHTML = '🚩';
    // Remove a single flag from the flag storage element
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

  // Disable the cell to make it non-interactive & apply default disabled style
  button.disabled = true;

  // Show the cell's value, if it's >0. Uses <b> to make the button text bold
  button.innerHTML = '<b>' + button.v;

  checkIfWon();

  if (!button.v) {
    // This button has a value of 0, but we don't want to show '0', so clear it
    // here. Overriding saves bytes compared to setting button text just once.
    button.innerHTML = '';

    // Reveal adjacent cells
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

  // If it's a bomb that was just clicked
  if (button.v > 8 && initial) {
    // Go through every button
    for (let i = 0; i < w * h; i++) {
      // Show all the bombs
      if (m.children[i].v > 8) {
        m.children[i].innerHTML = '💣';
      }

      // Disable all the buttons
      m.children[i].disabled = true;

      // Set the restart button state
      // (done inside the for loop to save 2B)
      restartButton.innerHTML = '😵';

      // Override the bomb with the explosion on the pressed button
      // (done inside the for loop to save 2B)
      button.innerHTML = '💥';
    }
  }
}

// Remove the default body margin
b.style.cssText = `
  margin: 0;
`;

// Controls container element is display: flex so button can be
controls.style.cssText = `
  margin: 1em;
  max-width: 4in;
  display: flex;
`;

// `font: size font-family;` shorthand with invalid font-family saves bytes.
// 'd' is the invalid font as it appears frequently before `;` in other CSS.
// width is 384/9*1.5=64 so it takes up 1 and a half square with default size.
// width in rem saves 2B 'cause 4rem = 64px, & it's similar to 'max-width:4in'.
restartButton.style.cssText = `
  margin-left: auto;
  max-width: 4rem;
  font: 1cm d;
  aspect-ratio: 1;
`;

// Width, height, and aspect ratio are inlined here, which saves lots of bytes,
// as the default 9x9 board is `aspect-ration: 1` (same as restartButton).
m.style.cssText = `
  margin: 1em;
  max-width: 4in;
  display: grid;
  grid: auto/repeat(${w},1fr);
  aspect-ratio: ${w/h};
`;

// Clicking the restartButton (when it's in any state) restarts the game
restartButton.onclick = start;

// Add flags and the restart button to their container element
controls.append(flagCountElement, restartButton);

// Add the controls container and the game map/board to the document body
b.append(controls, m);

// Start the game for the first time
start();

// Testing initially clicking corners to see what the grid looks like
// document.querySelectorAll('button')[ 1].click();
// document.querySelectorAll('button')[ 9].click();
// document.querySelectorAll('button')[73].click();
// document.querySelectorAll('button')[81].click();

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
