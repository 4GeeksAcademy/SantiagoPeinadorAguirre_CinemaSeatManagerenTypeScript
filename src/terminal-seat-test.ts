import readline from "node:readline";

const ROWS = 8;
const COLS = 10;
const OCCUPIED_SEATS = new Set(["C1", "D1", "F2", "B3", "I3", "E4", "H5", "A6", "D7", "G8"]);

function seatIdFromPosition(row: number, col: number): string {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

function getSeatPositionFromId(seatId: string): { row: number; col: number } | null {
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
  return { row, col };
}

function initializeSeatMatrix(rows: number, cols: number, occupiedSeatIds: Set<string>): number[][] {
  const matrix = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  occupiedSeatIds.forEach((seatId) => {
    const position = getSeatPositionFromId(seatId);
    if (position) {
      matrix[position.row][position.col] = 1;
    }
  });
  return matrix;
}

function countSeats(matrix: number[][]): { occupied: number; available: number } {
  let occupied = 0;
  for (const row of matrix) {
    for (const value of row) {
      if (value === 1) {
        occupied += 1;
      }
    }
  }
  return { occupied, available: ROWS * COLS - occupied };
}

function renderSeatMatrix(matrix: number[][], selectedSeats: Set<string>): string {
  const header = ["   ", ...Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i).padStart(2, " "))].join(" ");
  const lines = [header];

  for (let row = 0; row < ROWS; row += 1) {
    const rowLabel = String(row + 1).padStart(2, " ");
    const cells: string[] = [];
    for (let col = 0; col < COLS; col += 1) {
      const seatId = seatIdFromPosition(row, col);
      if (matrix[row][col] === 1) {
        cells.push(" X");
      } else if (selectedSeats.has(seatId)) {
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

function toggleSeat(matrix: number[][], selectedSeats: Set<string>, seatIdRaw: string): string {
  const seatId = seatIdRaw.trim().toUpperCase();
  const position = getSeatPositionFromId(seatId);
  if (!position) {
    return `Asiento invalido: ${seatIdRaw}. Usa formato A1..J8.`;
  }

  if (matrix[position.row][position.col] === 1) {
    return `No puedes seleccionar ${seatId}: ya esta ocupado.`;
  }

  if (selectedSeats.has(seatId)) {
    selectedSeats.delete(seatId);
    return `Deseleccionado ${seatId}.`;
  }

  selectedSeats.add(seatId);
  return `Seleccionado ${seatId}.`;
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
const selectedSeats = new Set<string>();

console.log("=== TEST TERMINAL APOLLO CINEMA (8x10) ===");
printHelp();
console.log(renderSeatMatrix(seatMatrix, selectedSeats));

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
      console.log(toggleSeat(seatMatrix, selectedSeats, seatId));
    }
  } else if (command === "status") {
    // No-op: se imprime debajo siempre para mantener feedback responsivo en cada accion.
  } else if (command === "confirm") {
    if (selectedSeats.size === 0) {
      console.log("No hay asientos seleccionados para confirmar.");
    } else {
      for (const seatId of selectedSeats) {
        const pos = getSeatPositionFromId(seatId);
        if (pos) {
          seatMatrix[pos.row][pos.col] = 1;
        }
      }
      console.log(`Confirmados ${selectedSeats.size} asientos: ${[...selectedSeats].sort().join(", ")}`);
      selectedSeats.clear();
    }
  } else if (command === "reset") {
    selectedSeats.clear();
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

  const totals = countSeats(seatMatrix);
  console.log(renderSeatMatrix(seatMatrix, selectedSeats));
  console.log(
    `Resumen -> Ocupados: ${totals.occupied} | Libres: ${totals.available} | Seleccionados: ${selectedSeats.size}`
  );
  rl.prompt();
});

rl.on("close", () => {
  console.log("\nSesion de test finalizada.");
  process.exit(0);
});
