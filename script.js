const boardSize = 8;
const mineCount = 10;
let board = [];
let mineLocations = [];
let cellsRevealed = 0;

function createBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = '';
    
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', onCellClick);
            board[i][j] = cell;
            boardElement.appendChild(cell);
        }
    }
}

function placeMines() {
    mineLocations = [];
    while (mineLocations.length < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        const location = `${row},${col}`;
        if (!mineLocations.includes(location)) {
            mineLocations.push(location);
            board[row][col].dataset.mine = 'true';
        }
    }
}

function onCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (cell.dataset.mine) {
        cell.classList.add('mine');
        alert('Game Over');
        revealBoard();
    } else {
        const mineCount = countMines(row, col);
        cell.classList.add('revealed');
       cellsRevealed++;
        if (mineCount > 0) {
            cell.textContent = mineCount;
            cell.classList.add('number');
          
        } else {
            revealEmptyCells(row, col);
         }
            checkWinCondition();
    }
}

function countMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol].dataset.mine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function revealEmptyCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                const cell = board[newRow][newCol];
                if (!cell.classList.contains('revealed')) {
                    cell.classList.add('revealed');
                    cellsRevealed++;
                    const mineCount = countMines(newRow, newCol);
                   
                    if (mineCount > 0) {
                        cell.textContent = mineCount;
                        cell.classList.add('number');
                    } else {
                        revealEmptyCells(newRow, newCol);
                    }
                }
            }
        }
    }
}

function revealBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = board[i][j];
            if (cell.dataset.mine) {
                cell.classList.add('mine');
            }
            cell.removeEventListener('click', onCellClick);
        }
    }
}

function initGame() {
    createBoard();
    placeMines();
}

window.onload = initGame;
