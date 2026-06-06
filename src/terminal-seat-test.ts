import readline from "node:readline";

const ROWS = 8;
const COLS = 10;

// Asientos ocupados iniciales en estructura JSON-compatible.
const OCCUPIED_SEATS = ["C1", "D1", "F2", "B3", "I3", "E4", "H5", "A6", "D7", "G8"];

function seatIdFromPosition(row: number, col: number): string {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

function getSeatPositionFromId(seatId: string): [number, number] | null {
  const normalized = seatId.trim().toUpperCase();
  const match = /^([A-J])(8|[1-7])$/.exec(normalized);
  if (!match) {
    return null;
  }

  const col = match[1].charCodeAt(0) - 65;
  const row = Number(match[2]) - 1;
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
    return null;
  }
  return [row, col];
}

// Codigos de la matriz: 0 = libre, 1 = comprado/ocupado, 2 = seleccionado temporalmente.
function initializeSeatMatrix(rows: number, cols: number, occupiedSeatIds: string[]): number[][] {
  const matrix = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  occupiedSeatIds.forEach((seatId) => {
    const position = getSeatPositionFromId(seatId);
    if (position) {
      matrix[position[0]][position[1]] = 1;
    }
  });
  return matrix;
}

function countSeats(matrix: number[][]): [number, number, number] {
  let occupied = 0;
  let available = 0;
  let selected = 0;

  for (const row of matrix) {
    for (const value of row) {
      if (value === 1) {
        occupied += 1;
      } else if (value === 2) {
        selected += 1;
      } else {
        available += 1;
      }
    }
  }

  return [occupied, available, selected];
}

function getSelectedSeatIds(matrix: number[][]): string[] {
  const seats: string[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (matrix[row][col] === 2) {
        seats.push(seatIdFromPosition(row, col));
      }
    }
  }
  return seats;
}

function renderSeatMatrix(matrix: number[][]): string {
  const header = ["   ", ...Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i).padStart(2, " "))].join(" ");
  const lines = [header];

  for (let row = 0; row < ROWS; row += 1) {
    const rowLabel = String(row + 1).padStart(2, " ");
    const cells: string[] = [];
    for (let col = 0; col < COLS; col += 1) {
      if (matrix[row][col] === 1) {
        cells.push(" X");
      } else if (matrix[row][col] === 2) {
        cells.push(" S");
      } else {
        cells.push(" L");
      }
    }
    lines.push(`${rowLabel}  ${cells.join(" ")}`);
  }

  lines.push("");
  lines.push("Leyenda: L=Libre, X=Ocupado, S=Seleccionado");
  return lines.join("\n");
}

function toggleSeat(matrix: number[][], seatIdRaw: string): string {
  const seatId = seatIdRaw.trim().toUpperCase();
  const position = getSeatPositionFromId(seatId);
  if (!position) {
    return `Asiento invalido: ${seatIdRaw}. Usa formato A1..J8.`;
  }

  const row = position[0];
  const col = position[1];
  if (matrix[row][col] === 1) {
    return `No puedes seleccionar ${seatId}: ya esta ocupado.`;
  }

  if (matrix[row][col] === 2) {
    matrix[row][col] = 0;
    return `Deseleccionado ${seatId}.`;
  }

  matrix[row][col] = 2;
  return `Seleccionado ${seatId}.`;
}

function confirmSelectedSeats(matrix: number[][]): string {
  const selectedSeatIds = getSelectedSeatIds(matrix);
  if (selectedSeatIds.length === 0) {
    return "No hay asientos seleccionados para confirmar.";
  }

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (matrix[row][col] === 2) {
        matrix[row][col] = 1;
      }
    }
  }

  return `Confirmados ${selectedSeatIds.length} asientos: ${selectedSeatIds.sort().join(", ")}`;
}

function resetSelectedSeats(matrix: number[][]): void {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (matrix[row][col] === 2) {
        matrix[row][col] = 0;
      }
    }
  }
}

function printHelp(): void {
  console.log("\nComandos disponibles:");
  console.log("  click A1       -> simula clic en asiento (toggle) [A-J][1-8]");
  console.log("  status         -> muestra matriz y resumen");
  console.log("  confirm        -> confirma seleccion y marca como ocupado");
  console.log("  reset          -> limpia seleccion temporal");
  console.log("  help           -> muestra ayuda");
  console.log("  exit           -> salir\n");
}

const seatMatrix = initializeSeatMatrix(ROWS, COLS, OCCUPIED_SEATS);

console.log("=== TEST TERMINAL APOLLO CINEMA (8x10) ===");
printHelp();
console.log(renderSeatMatrix(seatMatrix));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "apollo> "
});

rl.prompt();

rl.on("line", (line: string) => {
  const input = line.trim();
  const [commandRaw, ...rest] = input.split(/\s+/);
  const command = (commandRaw ?? "").toLowerCase();

  if (!command) {
    rl.prompt();
    return;
  }

  if (command === "click") {
    const seatId = rest[0] ?? "";
    if (!seatId) {
      console.log("Debes indicar un asiento. Ejemplo: click B7");
    } else {
      console.log(toggleSeat(seatMatrix, seatId));
    }
  } else if (command === "status") {
    // No-op: se imprime debajo siempre para mantener feedback responsivo en cada accion.
  } else if (command === "confirm") {
    console.log(confirmSelectedSeats(seatMatrix));
  } else if (command === "reset") {
    resetSelectedSeats(seatMatrix);
    console.log("Seleccion temporal reiniciada.");
  } else if (command === "help") {
    printHelp();
  } else if (command === "exit" || command === "quit") {
    rl.close();
    return;
  } else {
    console.log(`Comando no reconocido: ${command}`);
    printHelp();
  }

  const [occupied, available, selected] = countSeats(seatMatrix);
  console.log(renderSeatMatrix(seatMatrix));
  console.log(`Resumen -> Ocupados: ${occupied} | Libres: ${available} | Seleccionados: ${selected}`);
  rl.prompt();
});

rl.on("close", () => {
  console.log("\nSesion de test finalizada.");
  process.exit(0);
});
