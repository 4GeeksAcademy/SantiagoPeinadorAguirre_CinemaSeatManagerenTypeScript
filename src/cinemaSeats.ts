type CinemaRoom = number[][];

function createCinemaRoom(rows: number, columns: number): CinemaRoom {
  const room: CinemaRoom = [];

  for (let row = 0; row < rows; row++) {
    room[row] = [];

    for (let column = 0; column < columns; column++) {
      room[row][column] = 0;
    }
  }

  return room;
}

function getSeatSymbol(seat: number): string {
  if (seat === 1) {
    return "X";
  } else {
    return "L";
  }
}

function showCinemaRoom(room: CinemaRoom): void {
  let header = "  ";

  for (let column = 0; column < room[0].length; column++) {
    header = header + " " + (column + 1);
  }

  console.log(header);

  for (let row = 0; row < room.length; row++) {
    let line = row + 1 + " ";

    for (let column = 0; column < room[row].length; column++) {
      line = line + " " + getSeatSymbol(room[row][column]);
    }

    console.log(line);
  }
}

function reserveSeat(room: CinemaRoom, rowNumber: number, columnNumber: number): void {
  const rowIndex = rowNumber - 1;
  const columnIndex = columnNumber - 1;

  if (room[rowIndex][columnIndex] === 1) {
    console.log("Está ocupado");
  } else {
    room[rowIndex][columnIndex] = 1;
  }
}

function occupyRandomSeats(room: CinemaRoom, amount: number): void {
  const totalSeats = room.length * room[0].length;

  if (amount > totalSeats) {
    console.log("No hay tantos asientos en la sala");
    return;
  }

  for (let seat = 0; seat < amount; seat++) {
    const randomRow = Math.floor(Math.random() * room.length);
    const randomColumn = Math.floor(Math.random() * room[0].length);

    if (room[randomRow][randomColumn] === 0) {
      room[randomRow][randomColumn] = 1;
    } else {
      seat--;
    }
  }
}

function countSeats(room: CinemaRoom): void {
  let occupiedSeats = 0;
  let freeSeats = 0;

  for (let row = 0; row < room.length; row++) {
    for (let column = 0; column < room[row].length; column++) {
      if (room[row][column] === 1) {
        occupiedSeats++;
      } else {
        freeSeats++;
      }
    }
  }

  console.log("Asientos ocupados: " + occupiedSeats);
  console.log("Asientos libres: " + freeSeats);
}

function findTwoFreeSeatsTogether(room: CinemaRoom): number[][] {
  const positions: number[][] = [];

  for (let row = 0; row < room.length; row++) {
    for (let column = 0; column < room[row].length - 1; column++) {
      if (room[row][column] === 0 && room[row][column + 1] === 0) {
        positions[0] = [];
        positions[0][0] = row + 1;
        positions[0][1] = column + 1;

        positions[1] = [];
        positions[1][0] = row + 1;
        positions[1][1] = column + 2;

        return positions;
      }
    }
  }

  console.log("No hay dos asientos contiguos libres");
  return positions;
}

const cinemaRoom = createCinemaRoom(8, 10);

occupyRandomSeats(cinemaRoom, 20);

showCinemaRoom(cinemaRoom);
countSeats(cinemaRoom);

const freeSeatsTogether = findTwoFreeSeatsTogether(cinemaRoom);

if (freeSeatsTogether.length > 0) {
  console.log(
    "Primer par de asientos libres contiguos: fila " +
      freeSeatsTogether[0][0] +
      ", columnas " +
      freeSeatsTogether[0][1] +
      " y " +
      freeSeatsTogether[1][1]
  );
}