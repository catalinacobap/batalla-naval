// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const SIZE = 8;
    const SHIP_SIZES = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    const MAX_MOVES = 32;
  
    let board = [];
    let remainingMoves = MAX_MOVES;
    let sunkShips = 0;
    let ships = [];
  
    const tableroDiv = document.getElementById('tablero');
    const movimientosP = document.getElementById('movimientos');
    const estadoP = document.getElementById('estado');
    const botonIniciar = document.getElementById('botonIniciar');
  
    // Inicializar el tablero vacío
    const initializeBoard = () => {
      board = Array(SIZE * SIZE).fill(null);
    };
  
    // Colocar los barcos en el tablero de forma aleatoria sin que estén adyacentes
    const placeShips = () => {
      ships = [];
      SHIP_SIZES.forEach((size) => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100; // Para evitar bucles infinitos
  
        while (!placed && attempts < maxAttempts) {
          const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
          const position = getRandomPosition();
  
          const shipPositions = getShipPositions(position, size, orientation);
  
          if (shipPositions.length === size && isPlacementValid(shipPositions)) {
            shipPositions.forEach(pos => board[pos] = 'ship');
            ships.push({ positions: shipPositions, sunk: false });
            placed = true;
          }
          attempts++;
        }
  
        if (!placed) {
          console.warn(`No se pudo colocar el barco de tamaño ${size}`);
        }
      });
    };
  
    // Obtener una posición aleatoria en el tablero
    const getRandomPosition = () => Math.floor(Math.random() * SIZE * SIZE);
  
    // Obtener las posiciones del barco basado en la orientación
    const getShipPositions = (start, size, orientation) => {
      const positions = [];
      const row = Math.floor(start / SIZE);
      const col = start % SIZE;
  
      for (let i = 0; i < size; i++) {
        const newRow = orientation === 'vertical' ? row + i : row;
        const newCol = orientation === 'horizontal' ? col + i : col;
  
        if (newRow >= SIZE || newCol >= SIZE) return [];
  
        positions.push(newRow * SIZE + newCol);
      }
  
      return positions;
    };
  
    // Verificar si la colocación del barco es válida (sin solapamientos ni adyacentes)
    const isPlacementValid = (positions) => {
      return positions.every(pos => board[pos] === null) &&
        positions.every(pos => !hasAdjacentShip(pos));
    };
  
    // Verificar si una celda tiene barcos adyacentes
    const hasAdjacentShip = (index) => {
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
  
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
  
          if (newRow >= 0 && newRow < SIZE && newCol >= 0 && newCol < SIZE) {
            const adjIndex = newRow * SIZE + newCol;
            if (board[adjIndex] === 'ship') return true;
          }
        }
      }
  
      return false;
    };
  
    // Actualizar elementos de la interfaz
    const updateUI = () => {
      movimientosP.textContent = `Movimientos restantes: ${remainingMoves}`;
      estadoP.textContent = `Barcos derribados: ${sunkShips} / ${SHIP_SIZES.length}`;
    };
  
    // Manejar el clic en una casilla usando delegación de eventos
    const handleCellClick = (event) => {
      const target = event.target;
      if (!target.classList.contains('tile') || target.disabled) return;
  
      const index = parseInt(target.dataset.indice, 10);
  
      if (board[index] === 'ship') {
        target.classList.add('hit');
        board[index] = 'hit';
        checkSunkShip(index);
      } else {
        target.classList.add('miss');
        board[index] = 'miss';
      }
  
      target.disabled = true;
      remainingMoves--;
      updateUI();
      checkGameEnd();
    };
  
    // Verificar si un barco ha sido derribado
    const checkSunkShip = (hitIndex) => {
      const ship = ships.find(s => s.positions.includes(hitIndex));
      if (ship && !ship.sunk) {
        const isSunk = ship.positions.every(pos => board[pos] === 'hit');
        if (isSunk) {
          sunkShips++;
          ship.sunk = true;
        }
      }
    };
  
    // Verificar si el juego ha terminado
    const checkGameEnd = () => {
      if (sunkShips === SHIP_SIZES.length) {
        setTimeout(() => {
          alert('¡Felicidades! Has derribado todos los barcos.');
          resetGame();
        }, 100);
      } else if (remainingMoves === 0) {
        setTimeout(() => {
          alert('¡Fin del juego! Te has quedado sin movimientos.');
          resetGame();
        }, 100);
      }
    };
  
    // Reiniciar el juego
    const resetGame = () => {
      remainingMoves = MAX_MOVES;
      sunkShips = 0;
      initializeBoard();
      placeShips();
      renderBoard();
      updateUI();
    };
  
    // Renderizar el tablero en la interfaz
    const renderBoard = () => {
      tableroDiv.innerHTML = '';
      const fragment = document.createDocumentFragment();
  
      for (let i = 0; i < SIZE * SIZE; i++) {
        const button = document.createElement('button');
        button.classList.add('tile');
        button.dataset.indice = i;
        fragment.appendChild(button);
      }
  
      tableroDiv.appendChild(fragment);
    };
  
    // Inicializar el juego
    const init = () => {
      renderBoard();
      initializeBoard();
      placeShips();
      updateUI();
    };
  
    // Añadir listeners de eventos
    tableroDiv.addEventListener('click', handleCellClick);
    botonIniciar.addEventListener('click', resetGame);
  
    // Iniciar el juego al cargar
    init();
  });
  