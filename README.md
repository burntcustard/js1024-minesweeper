# js1024-minesweeper

<img src="https://github.com/burntcustard/js1024-minesweeper/blob/main/screenshot-x1.png?raw=true" width="208" height="248" alt="Screenshot of the game, showing flags in the top left a button with a smiley face in the top right, and a 10 by 10 grid of buttons in the center, some with flags some with numbers on."/>

### [Play online](https://burnt.io/js1024-minesweeper)

> [js1024](https://js1024.fun/) entry - the total size of [index.html](index.html) is less than 1024B!

### How to play

- Left click or press on a square to reveal it's contents. If it's a 💣 you lose 😵
- Right click or long-press on a square to place a 🚩 on it.
- A square's neighbors are the squares above, right, below, left, and all 4 diagonals. 🔆
- If a revealed square has a number, that number indicates how many neighboring 💣 it has.
- If you reveal a square with no neighboring 💣, all its neighbors automatically open.
- To win, all squares containing 💣 must have 🚩 on them, and all other squares must be revealed 🤩
- Click the 🙂 in the top right at any time to restart 🔁

---

### Run locally

1. Clone this repo  
  `git clone git@github.com:burntcustard/js1024-minesweeper.git`

2. Install dependencies  
  `npm install`

3. Run watch command to start up hot-reloading browser-sync  
  `npm run watch`

### Making things more difficult

If running locally, by editing [main.js](src/main.js), you can:
- Change the number of squares in the game board with the `w` and `h` variables:
  ```js
  const w = 30;  // default: 9
  const h = 16;  // default: 9
  ```
- Change the display size of the game with the `max-width` of `controls.style.cssText` and `m.style.cssText`:
  ```js
  controls.style.cssText = `
    margin: 1em;
    max-width: 13.2in;  ${/* default: 4in */}
    display: flex;
  `;
  m.style.cssText = `
    margin: 1em;
    max-width: 13.2in;  ${/* default: 4in */}
    display: grid;
    grid: repeat(${h},1fr)/repeat(${w},1fr);
    aspect-ratio: ${w/h};
  `;
  ```
- Change the number of 💣 and 🚩 with the `numBombs` variable:
  ```js
  let numBombs = 99;  // default 10
  ```
- Remove the requirement to 🚩 all 💣, like in traditional Minesweeper, by removing the following line inside `checkIfWon`:
  ```js
  (m.children[i].v > 8 && m.children[i].innerHTML !== '🚩') ||
  ```
