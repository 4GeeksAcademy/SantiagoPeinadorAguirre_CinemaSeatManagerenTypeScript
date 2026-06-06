import "./style.css";

// Tipos nucleares del modulo: estado de butaca, idioma y entidades del dominio.
type SeatState = "available" | "occupied";
type Language = "VOSE" | "Castellano";

type Seat = {
  id: string;
  state: SeatState;
};

type Movie = {
  title: string;
  poster: string;
  genre: string;
  tags: string[];
  synopsis: string;
  director: string;
  actors: string[];
  room: number;
  sessions: Record<Language, string[]>;
};

type Snack = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
};

// Etiquetas visuales del flujo superior (wizard de compra).
const STEP_LABELS = [
  "Pelicula y horario",
  "Seleccion de butaca",
  "Tienda y pago",
  "Confirmacion"
];

// Parametros economicos globales de la app.
// TICKET_PRICE: coste unitario por asiento reservado.
// TAX_RATE: IVA aplicado al subtotal de entradas + tienda.
const TICKET_PRICE = 11.2;
const TAX_RATE = 0.21;

// Cartelera principal de peliculas. Cada ficha incluye metadata de cine,
// sala y sesiones separadas por idioma.
const MOVIES: Movie[] = [
  {
    title: "Cartas al Mar",
    poster: "/img_ref/MOVIES/CARTASL_AL_MAR.webp",
    genre: "Drama romantico",
    tags: ["Intimo", "Emotivo", "Nostalgico"],
    synopsis:
      "Una restauradora de cartas antiguas descubre una correspondencia perdida que la conecta con una historia de amor inacabada frente al mar Cantabrico.",
    director: "Lucia Varela",
    actors: ["Ines Cebrian", "Javier Montero", "Paula Requena"],
    room: 2,
    sessions: {
      VOSE: ["16:10", "19:00", "21:40"],
      Castellano: ["17:25", "20:15"]
    }
  },
  {
    title: "Eclipse de Titan",
    poster: "/img_ref/MOVIES/ECLIPSE_DE_TITAN.webp",
    genre: "Ciencia ficcion",
    tags: ["Espacial", "Suspense", "Aventura"],
    synopsis:
      "Una tripulacion cientifica llega a Titan y detecta una senal imposible que podria reescribir el origen de la vida en el sistema solar.",
    director: "Arturo Navas",
    actors: ["Clara Duenas", "Mateo Vidal", "Izan Salvat"],
    room: 5,
    sessions: {
      VOSE: ["15:50", "18:35", "21:20", "23:40"],
      Castellano: ["16:40", "19:25", "22:10"]
    }
  },
  {
    title: "El Reino de Ceniza",
    poster: "/img_ref/MOVIES/EL_REINO_DE_CENIZA.webp",
    genre: "Fantasia epica",
    tags: ["Magia", "Accion", "Aventura"],
    synopsis:
      "Una heredera desterrada cruza tierras arrasadas para reunir a tres clanes y enfrentarse al regente que gobierna mediante fuego y miedo.",
    director: "Sergio Alaminos",
    actors: ["Nora Beltran", "Adrian Funes", "Leire Rosales"],
    room: 1,
    sessions: {
      VOSE: ["17:00", "20:00"],
      Castellano: ["15:30", "18:30", "21:30"]
    }
  },
  {
    title: "La Casa del Silencio",
    poster: "/img_ref/MOVIES/LA%20CASA%20DEL%20SILENCIO.webp",
    genre: "Terror psicologico",
    tags: ["Terror", "Misterio", "Thriller"],
    synopsis:
      "Una familia se muda a una mansion donde el sonido desaparece cada medianoche, mientras una presencia exige ser escuchada a traves del silencio.",
    director: "Helena Cortes",
    actors: ["Diego Ariza", "Marta Lozano", "Eric Mena"],
    room: 4,
    sessions: {
      VOSE: ["19:10", "22:00"],
      Castellano: ["18:00", "20:50", "23:20"]
    }
  },
  {
    title: "Robo en la Gran Via",
    poster: "/img_ref/MOVIES/ROBO_EN_LA_GRAN_VIA.webp",
    genre: "Comedia de atracos",
    tags: ["Comedia", "Heist", "Urbano"],
    synopsis:
      "Un grupo de extras de cine planea el golpe perfecto durante un rodaje nocturno en Madrid, pero cada improvisacion complica mas el plan.",
    director: "Pablo Escudero",
    actors: ["Rocio Lara", "Alvaro Campos", "Sofia Naranjo"],
    room: 3,
    sessions: {
      VOSE: ["16:20", "19:35"],
      Castellano: ["17:10", "20:25", "22:45"]
    }
  }
].sort((a, b) => a.title.localeCompare(b.title, "es"));

// Catalogo de tienda (menus de palomitas y golosinas) con precio unitario.
const SNACKS: Snack[] = [
  {
    id: "clasico",
    name: "Combo Clasico",
    image: "/img_ref/MENUS/COMBO_CLASICO.webp",
    description: "Palomitas medianas + bebida + gominolas.",
    price: 8.5
  },
  {
    id: "dulce",
    name: "Combo Dulce",
    image: "/img_ref/MENUS/COMBO_DULCE.webp",
    description: "Palomitas dulces + chocolatinas + refresco.",
    price: 9.2
  },
  {
    id: "familiar",
    name: "Combo Familiar",
    image: "/img_ref/MENUS/COMBO_FAMILIAR.webp",
    description: "Cubo grande de palomitas + 2 bebidas + surtido.",
    price: 14.9
  },
  {
    id: "nachos",
    name: "Combo Nachos",
    image: "/img_ref/MENUS/COMBO_NACHOS.webp",
    description: "Nachos con cheddar + palomitas + bebida.",
    price: 10.8
  },
  {
    id: "pareja",
    name: "Combo Pareja",
    image: "/img_ref/MENUS/COMBO_PAREJA.webp",
    description: "Palomitas grandes + 2 bebidas + golosinas.",
    price: 12.4
  }
];

// Geometria base de la sala.
const ROWS = 8;
const COLS = 10;

// Asientos ocupados al iniciar la app (estado simulado inicial).
const OCCUPIED_SEATS = new Set(["C1", "D1", "F2", "B3", "I3", "E4", "H5", "A6", "D7", "G8"]);

// Estado vivo de la experiencia de compra.
// Aqui se almacenan elecciones de usuario para navegar entre pasos.
let currentStep = 1;
let selectedMovie: Movie | null = null;
let selectedLanguage: Language | "" = "";
let selectedTime = "";
let selectedSeats = new Set<string>();
let selectedSnacks = new Map<string, number>();
let receiptEmail = "";

// Crea una matriz de asientos 8x10 donde 0 = libre y 1 = ocupado.
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

// Convierte una coordenada de matriz a un identificador de asiento.
// Regla de negocio: columnas A-J y filas 1-8 (ejemplo: A1, J8).
function seatIdFromPosition(row: number, col: number): string {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

// Convierte un identificador de asiento (A1..J8) en coordenadas de matriz.
function getSeatPositionFromId(seatId: string): { row: number; col: number } | null {
  const match = /^([A-J])(8|[1-7])$/.exec(seatId);
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

// Muestra en consola la sala usando X para ocupado y L para libre.
// Encabezado: columnas A-J. Filas: 1-8.
function printSeatMatrix(matrix: number[][]): void {
  const header = ["   ", ...Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i).padStart(2, " "))].join(" ");
  console.log(header);
  matrix.forEach((rowValues, rowIndex) => {
    const label = String(rowIndex + 1).padStart(2, " ");
    const rowText = rowValues.map((value) => (value === 1 ? " X" : " L")).join(" ");
    console.log(`${label}  ${rowText}`);
  });
}

// Reserva un asiento por fila y columna con validacion y mensaje claro de resultado.
function reserveSeat(matrix: number[][], row: number, col: number): { success: boolean; message: string } {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
    return { success: false, message: "Reserva fallida: posicion fuera de rango." };
  }
  if (matrix[row][col] === 1) {
    return { success: false, message: `Reserva fallida: el asiento ${seatIdFromPosition(row, col)} ya esta ocupado.` };
  }
  matrix[row][col] = 1;
  return { success: true, message: `Reserva confirmada: asiento ${seatIdFromPosition(row, col)}.` };
}

// Cuenta asientos ocupados y libres de toda la sala.
function countSeats(matrix: number[][]): { occupied: number; available: number } {
  let occupied = 0;
  matrix.forEach((rowValues) => {
    rowValues.forEach((value) => {
      if (value === 1) {
        occupied += 1;
      }
    });
  });
  return { occupied, available: ROWS * COLS - occupied };
}

// Busca el primer par de asientos libres contiguos horizontalmente.
function findFirstAdjacentFreeSeats(
  matrix: number[][]
): { found: true; seats: [string, string]; message: string } | { found: false; message: string } {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS - 1; col += 1) {
      if (matrix[row][col] === 0 && matrix[row][col + 1] === 0) {
        const left = seatIdFromPosition(row, col);
        const right = seatIdFromPosition(row, col + 1);
        return {
          found: true,
          seats: [left, right],
          message: `Asientos contiguos encontrados: ${left} y ${right}.`
        };
      }
    }
  }
  return { found: false, message: "No hay asientos contiguos disponibles." };
}

const seatMatrix = initializeSeatMatrix(ROWS, COLS, OCCUPIED_SEATS);

// Recupera un elemento del DOM y garantiza en tiempo de ejecucion que existe.
// Si el selector no encuentra nodo, se lanza error para evitar estados silenciosos.
function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`No se encontro el elemento: ${selector}`);
  }
  return element;
}

const stepFlow = requiredElement<HTMLDivElement>("#progressFlow");
const goHomeMainBtn = requiredElement<HTMLButtonElement>("#goHomeMainBtn");

// Bloque de seleccion de cartelera y resumen del paso 1.
const movieCatalog = requiredElement<HTMLDivElement>("#movieCatalog");
const selectionSummary = requiredElement<HTMLDivElement>("#selectionSummary");

// Bloque de butacas y resumen de ocupacion del paso 2.
const roomInfo = requiredElement<HTMLParagraphElement>("#roomInfo");
const seatGrid = requiredElement<HTMLDivElement>("#seatGrid");
const seatSummary = requiredElement<HTMLParagraphElement>("#seatSummary");

// Bloque de tienda y checkout del paso 3.
const snackCatalog = requiredElement<HTMLDivElement>("#snackCatalog");
const checkoutSummary = requiredElement<HTMLDivElement>("#checkoutSummary");

// Controles de navegacion entre pasos.
const toStep2Btn = requiredElement<HTMLButtonElement>("#toStep2Btn");
const toStep3Btn = requiredElement<HTMLButtonElement>("#toStep3Btn");
const backToStep1Btn = requiredElement<HTMLButtonElement>("#backToStep1Btn");
const backToStep2Btn = requiredElement<HTMLButtonElement>("#backToStep2Btn");
const backToStep3Btn = requiredElement<HTMLButtonElement>("#backToStep3Btn");

// Formulario de pago y bloque de confirmacion final.
const paymentForm = requiredElement<HTMLFormElement>("#paymentForm");
const paymentError = requiredElement<HTMLParagraphElement>("#paymentError");
const confirmationTitle = requiredElement<HTMLParagraphElement>("#confirmationTitle");
const confirmationDetails = requiredElement<HTMLDivElement>("#confirmationDetails");
const profileBtn = requiredElement<HTMLButtonElement>("#profileBtn");

// Referencias ordenadas de las tarjetas para facilitar operaciones por indice de paso.
const stepCards = [
  requiredElement<HTMLElement>("#stepCard1"),
  requiredElement<HTMLElement>("#stepCard2"),
  requiredElement<HTMLElement>("#stepCard3"),
  requiredElement<HTMLElement>("#stepCard4")
];

// Formatea valores monetarios en string estandar de la aplicacion.
function formatEuro(value: number): string {
  return `${value.toFixed(2)} EUR`;
}

// Calcula el subtotal de entradas segun cantidad de asientos seleccionados.
function getSeatSubtotal(): number {
  return selectedSeats.size * TICKET_PRICE;
}

// Calcula el subtotal de tienda multiplicando precio por cantidad de cada combo.
function getSnacksSubtotal(): number {
  return SNACKS.reduce((total, snack) => total + snack.price * (selectedSnacks.get(snack.id) ?? 0), 0);
}

// Suma subtotales de entradas y tienda antes de impuestos.
function getSubtotal(): number {
  return getSeatSubtotal() + getSnacksSubtotal();
}

// Aplica IVA del 21% sobre el subtotal para obtener el importe fiscal.
function getTaxAmount(): number {
  return getSubtotal() * TAX_RATE;
}

// Devuelve el total final de checkout incluyendo impuestos.
function getTotalWithTax(): number {
  return getSubtotal() + getTaxAmount();
}

// Valida que el paso 1 este completo: pelicula, idioma y horario definidos.
function isStep1Complete(): boolean {
  return Boolean(selectedMovie && selectedLanguage && selectedTime);
}

// Valida que el paso 2 tenga al menos un asiento seleccionado.
function isStep2Complete(): boolean {
  return selectedSeats.size > 0;
}

// Determina hasta que paso puede avanzar el usuario segun el estado actual.
// Reglas: paso 4 solo con compra finalizada, paso 3 con paso 1+2 completos,
// paso 2 con paso 1 completo, y paso 1 en cualquier otro caso.
function getMaxUnlockedStep(): number {
  if (receiptEmail) {
    return 4;
  } else if (isStep1Complete() && isStep2Complete()) {
    return 3;
  } else if (isStep1Complete()) {
    return 2;
  } else {
    return 1;
  }
}

// Activa o desactiva visual e interactivamente una tarjeta de paso.
// Se usa para bloquear pasos que aun no deben ser navegables.
function setCardEnabled(card: HTMLElement, enabled: boolean): void {
  if (enabled) {
    card.classList.remove("opacity-50", "grayscale-[0.2]");
    card.style.pointerEvents = "auto";
    return;
  }
  card.classList.add("opacity-50", "grayscale-[0.2]");
  card.style.pointerEvents = "none";
}

// Sincroniza que tarjetas deben estar habilitadas segun el avance del flujo.
function syncStepAccess(): void {
  setCardEnabled(stepCards[1], isStep1Complete());
  setCardEnabled(stepCards[2], isStep1Complete() && isStep2Complete());
}

// Muestra solo la tarjeta del paso activo y oculta las demas con display.
function syncCardVisibility(): void {
  stepCards.forEach((card, index) => {
    card.style.display = index + 1 === currentStep ? "block" : "none";
  });
}

// Renderiza la barra de progreso de 4 pasos con estados activo/completado/pendiente.
function renderFlow(): void {
  stepFlow.innerHTML = STEP_LABELS.map((label, index) => {
    const step = index + 1;
    const isActive = step === currentStep;
    const isDone = step < currentStep;
    const circleClass = isDone
      ? "bg-emerald-500 border-emerald-600 text-white"
      : isActive
        ? "bg-sky-600 border-sky-700 text-white"
        : "bg-sky-100 border-sky-300 text-sky-700";
    const lineClass = step < STEP_LABELS.length ? (isDone ? "bg-emerald-500" : "bg-sky-300/80") : "";

    return `
      <div class="relative px-1 pt-1">
        <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${circleClass}">${step}</div>
        <p class="mt-2 text-center text-xs leading-tight sm:text-sm ${isActive ? "text-sky-900" : "text-slate-600"}">${label}</p>
        <div class="mt-1 text-center text-[11px] text-slate-500 sm:text-xs">Paso ${step}</div>
        ${
          step < STEP_LABELS.length
            ? `<span class="pointer-events-none absolute left-1/2 top-6 hidden h-[2px] w-full ${lineClass} sm:block"></span>`
            : ""
        }
      </div>
    `;
  }).join("");
}

// Resalta visualmente la tarjeta del paso activo para reforzar contexto de navegacion.
function renderCardHighlights(): void {
  stepCards.forEach((card, index) => {
    const step = index + 1;
    if (step === currentStep) {
      card.classList.add("ring-2", "ring-sky-400/80", "shadow-[0_0_0_1px_rgba(56,189,248,0.2),0_18px_35px_rgba(59,130,246,0.15)]");
    } else {
      card.classList.remove("ring-2", "ring-sky-400/80", "shadow-[0_0_0_1px_rgba(56,189,248,0.2),0_18px_35px_rgba(59,130,246,0.15)]");
    }
  });
}

// Cambia de paso aplicando limites de seguridad y refrescando toda la UI dependiente.
function setStep(step: number): void {
  currentStep = Math.min(getMaxUnlockedStep(), Math.max(1, step));
  renderFlow();
  renderCardHighlights();
  syncStepAccess();
  syncCardVisibility();
}

// Genera botones de sesion para una pelicula e idioma concretos.
// Cada boton arrastra metadatos para que un solo listener maneje la seleccion.
function getSessionButtons(movie: Movie, language: Language): string {
  return movie.sessions[language].map((time) => {
    const isActive = selectedMovie?.title === movie.title && selectedLanguage === language && selectedTime === time;
    const style = isActive
      ? "border-sky-500 bg-sky-600 text-white"
      : "border-sky-200 bg-white text-sky-700 hover:border-sky-400";
    return `
      <button
        type="button"
        data-action="select-session"
        data-movie-title="${movie.title}"
        data-language="${language}"
        data-time="${time}"
        class="inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${style}"
      >
        ${time}
      </button>
    `;
  }).join("");
}

// Dibuja el catalogo completo de peliculas ordenado alfabeticamente.
// Cada ficha incluye poster, metadata, etiquetas y sesiones VOSE/Castellano integradas.
function renderMovieCatalog(): void {
  movieCatalog.innerHTML = MOVIES.map((movie) => {
    const isSelectedMovie = selectedMovie?.title === movie.title;
    const cardClass = isSelectedMovie
      ? "border-sky-500 bg-sky-100/80 ring-2 ring-sky-300"
      : "border-sky-200 bg-white";

    const tags = movie.tags
      .map((tag) => `<span class="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700">${tag}</span>`)
      .join(" ");

    return `
      <article class="rounded-xl border p-3 transition ${cardClass}">
        <img src="${movie.poster}" alt="Poster de ${movie.title}" class="aspect-[2/3] w-full rounded-lg object-cover" />
        <div class="mt-3 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-semibold text-slate-900">${movie.title}</p>
            <span class="rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-semibold text-white">${movie.genre}</span>
          </div>
          <div class="flex flex-wrap gap-1">${tags}</div>
          <p class="text-xs text-slate-600">${movie.synopsis}</p>
          <p class="text-xs text-slate-700"><span class="font-semibold">Director:</span> ${movie.director}</p>
          <p class="text-xs text-slate-700"><span class="font-semibold">Reparto:</span> ${movie.actors.join(", ")}</p>
          <p class="text-xs font-semibold text-sky-700">Sala ${movie.room}</p>
          <button
            type="button"
            data-action="select-movie"
            data-movie-title="${movie.title}"
            class="inline-flex items-center rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-50"
          >
            Seleccionar pelicula
          </button>
          <div class="rounded-lg border border-sky-200 bg-white/80 p-2">
            <p class="mb-1 text-[11px] font-semibold text-slate-700">VOSE</p>
            <div class="flex flex-wrap gap-1.5">${getSessionButtons(movie, "VOSE")}</div>
          </div>
          <div class="rounded-lg border border-sky-200 bg-white/80 p-2">
            <p class="mb-1 text-[11px] font-semibold text-slate-700">Castellano</p>
            <div class="flex flex-wrap gap-1.5">${getSessionButtons(movie, "Castellano")}</div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Resume en texto la seleccion actual del paso 1 para confirmar contexto al usuario.
function renderSelectionSummary(): void {
  if (!selectedMovie) {
    selectionSummary.textContent = "Selecciona una pelicula y pulsa un horario para confirmar idioma, sala y funcion.";
    return;
  }

  const languageLabel = selectedLanguage || "Pendiente";
  const timeLabel = selectedTime || "Pendiente";
  selectionSummary.innerHTML = `
    <p><span class="font-semibold text-sky-700">Pelicula:</span> ${selectedMovie.title}</p>
    <p><span class="font-semibold text-sky-700">Genero:</span> ${selectedMovie.genre}</p>
    <p><span class="font-semibold text-sky-700">Idioma:</span> ${languageLabel}</p>
    <p><span class="font-semibold text-sky-700">Horario:</span> ${timeLabel}</p>
    <p><span class="font-semibold text-sky-700">Sala:</span> ${selectedMovie.room}</p>
  `;
}

// Refleja en el paso 2 la sala asignada a la pelicula elegida.
function updateRoomInfo(): void {
  roomInfo.textContent = selectedMovie ? `Sala asignada: ${selectedMovie.room}` : "Sala asignada: -";
}

// Muestra resumen de asientos seleccionados y metricas globales de ocupacion.
function renderSeatSummary(): void {
  const totals = countSeats(seatMatrix);
  const selectedCount = selectedSeats.size;
  const availableCount = Math.max(0, totals.available - selectedCount);

  if (selectedSeats.size === 0) {
    seatSummary.textContent = `Asientos -> ✓ Disponibles: ${totals.available} | ✕ Comprados: ${totals.occupied} | ○ Seleccionados: 0`;
    return;
  }

  seatSummary.textContent = `Asientos -> ✓ Disponibles: ${availableCount} | ✕ Comprados: ${totals.occupied} | ○ Seleccionados: ${selectedCount} | Entradas: ${formatEuro(getSeatSubtotal())}`;
}

// Devuelve clases visuales segun estado del asiento (ocupado, seleccionado, libre).
function seatClass(seat: Seat): string {
  if (seat.state === "occupied") {
    return "cursor-not-allowed border-red-700 bg-red-600 text-white";
  } else if (selectedSeats.has(seat.id)) {
    return "border-emerald-700 bg-emerald-600 text-white";
  } else {
    return "border-slate-500 bg-slate-300 text-slate-900 hover:brightness-110";
  }
}

// Devuelve el simbolo visible de la butaca segun estado solicitado por negocio.
function seatSymbol(seat: Seat): string {
  if (seat.state === "occupied") {
    return "✕";
  }
  if (selectedSeats.has(seat.id)) {
    return "○";
  }
  return "✓";
}

// Pinta la rejilla completa de asientos leyendo la matriz 8x10 actual.
// Se mantiene sincronizada con reservas existentes y seleccion temporal del usuario.
function renderSeatGrid(): void {
  const seats: Seat[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const id = seatIdFromPosition(row, col);
      seats.push({ id, state: seatMatrix[row][col] === 1 ? "occupied" : "available" });
    }
  }

  const rowInsetClasses = [
    "px-8 sm:px-12",
    "px-7 sm:px-10",
    "px-6 sm:px-9",
    "px-5 sm:px-8",
    "px-4 sm:px-7",
    "px-3 sm:px-6",
    "px-2 sm:px-5",
    "px-1 sm:px-4"
  ];

  const buildAisleRow = (items: string[]): string => {
    const left = items.slice(0, 5).join("");
    const right = items.slice(5).join("");
    return `${left}<span class="inline-block w-4 sm:w-6" aria-hidden="true"></span>${right}`;
  };

  const headerItems = Array.from({ length: COLS }, (_, col) => {
    const colLetter = String.fromCharCode(65 + col);
    return `<span class="inline-flex h-7 w-7 items-center justify-center text-[11px] font-bold text-slate-600 sm:h-8 sm:w-8 sm:text-xs">${colLetter}</span>`;
  });

  const rowsHtml = Array.from({ length: ROWS }, (_, row) => {
    const rowItems = Array.from({ length: COLS }, (_, col) => {
      const seat = seats[row * COLS + col];
      const disabled = seat.state === "occupied" ? "disabled" : "";
      return `<button ${disabled} data-seat-id="${seat.id}" title="${seat.id}" aria-label="Asiento ${seat.id}" class="inline-flex h-7 w-7 items-center justify-center rounded border text-sm font-semibold transition sm:h-8 sm:w-8 ${seatClass(seat)}">${seatSymbol(seat)}</button>`;
    });

    return `
      <div class="flex items-center gap-2">
        <span class="w-5 text-right text-xs font-bold text-slate-600 sm:w-6 sm:text-sm">${row + 1}</span>
        <div class="flex-1 ${rowInsetClasses[row]}">
          <div class="flex items-center justify-center gap-1 sm:gap-1.5">
            ${buildAisleRow(rowItems)}
          </div>
        </div>
      </div>
    `;
  }).join("");

  seatGrid.innerHTML = `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="w-5 sm:w-6" aria-hidden="true"></span>
        <div class="flex-1 px-1 sm:px-4">
          <div class="flex items-center justify-center gap-1 sm:gap-1.5">
            ${buildAisleRow(headerItems)}
          </div>
        </div>
      </div>
      ${rowsHtml}
    </div>
  `;
}

// Renderiza el catalogo de tienda con controles +/- y cantidades por producto.
function renderSnackCatalog(): void {
  snackCatalog.innerHTML = SNACKS.map((snack) => {
    const qty = selectedSnacks.get(snack.id) ?? 0;
    return `
      <article class="rounded-xl border border-sky-200 bg-white p-3">
        <img src="${snack.image}" alt="${snack.name}" class="h-28 w-full rounded-lg object-cover" />
        <p class="mt-2 text-sm font-semibold text-slate-900">${snack.name}</p>
        <p class="mt-1 text-xs text-slate-600">${snack.description}</p>
        <p class="mt-1 text-xs font-semibold text-sky-700">${formatEuro(snack.price)}</p>
        <div class="mt-2 flex items-center gap-2">
          <button type="button" data-action="dec-snack" data-snack-id="${snack.id}" class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-sky-300 bg-white text-sm font-semibold text-sky-700">-</button>
          <span class="min-w-6 text-center text-sm font-semibold text-slate-700">${qty}</span>
          <button type="button" data-action="inc-snack" data-snack-id="${snack.id}" class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-sky-300 bg-white text-sm font-semibold text-sky-700">+</button>
        </div>
      </article>
    `;
  }).join("");
}

// Construye el checkout dinamico: entradas, tienda, subtotal, IVA y total final.
function renderCheckoutSummary(): void {
  const seatCount = selectedSeats.size;
  const snacksCount = [...selectedSnacks.values()].reduce((sum, qty) => sum + qty, 0);
  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const total = getTotalWithTax();

  checkoutSummary.innerHTML = `
    <p><span class="font-semibold text-sky-700">Entradas:</span> ${seatCount} x ${formatEuro(TICKET_PRICE)} = ${formatEuro(getSeatSubtotal())}</p>
    <p><span class="font-semibold text-sky-700">Tienda:</span> ${snacksCount} productos = ${formatEuro(getSnacksSubtotal())}</p>
    <p><span class="font-semibold text-sky-700">Subtotal:</span> ${formatEuro(subtotal)}</p>
    <p><span class="font-semibold text-sky-700">IVA (21%):</span> ${formatEuro(tax)}</p>
    <p class="text-base font-semibold text-emerald-700">Total checkout: ${formatEuro(total)}</p>
  `;
}

// Genera lineas de recibo para productos de tienda con cantidad > 0.
function getSnackReceiptLines(): string {
  const lines = SNACKS
    .map((snack) => {
      const qty = selectedSnacks.get(snack.id) ?? 0;
      if (qty === 0) {
        return "";
      }
      return `<p><span class=\"text-sky-700\">${snack.name}:</span> ${qty} x ${formatEuro(snack.price)}</p>`;
    })
    .filter((line) => line !== "");

  return lines.length > 0 ? lines.join("") : "<p><span class=\"text-sky-700\">Tienda:</span> Sin productos anadidos</p>";
}

// Actualiza el paso de confirmacion con detalle completo de compra y pagos.
function updateConfirmation(): void {
  if (!receiptEmail || !selectedMovie) {
    confirmationTitle.textContent = "Pendiente de confirmar compra.";
    confirmationDetails.innerHTML = "";
    return;
  }

  const seats = [...selectedSeats].sort((a, b) => a.localeCompare(b));
  confirmationTitle.textContent = "Compra confirmada. Recibo enviado correctamente.";
  confirmationDetails.innerHTML = `
    <p><span class="text-sky-700">Pelicula:</span> ${selectedMovie.title}</p>
    <p><span class="text-sky-700">Idioma:</span> ${selectedLanguage}</p>
    <p><span class="text-sky-700">Horario:</span> ${selectedTime}</p>
    <p><span class="text-sky-700">Sala:</span> ${selectedMovie.room}</p>
    <p><span class="text-sky-700">Asientos:</span> ${seats.join(", ")}</p>
    ${getSnackReceiptLines()}
    <p><span class="text-sky-700">Subtotal:</span> ${formatEuro(getSubtotal())}</p>
    <p><span class="text-sky-700">IVA (21%):</span> ${formatEuro(getTaxAmount())}</p>
    <p><span class="text-sky-700">Total pagado:</span> ${formatEuro(getTotalWithTax())}</p>
    <p><span class="text-sky-700">Email de recibo:</span> ${receiptEmail}</p>
  `;
}

// Muestra un mensaje de error de pago visible en el formulario.
function showPaymentError(message: string): void {
  paymentError.textContent = message;
  paymentError.classList.remove("hidden");
}

// Oculta y limpia el mensaje de error de pago.
function hidePaymentError(): void {
  paymentError.textContent = "";
  paymentError.classList.add("hidden");
}

// Reinicia estado de pedido cuando cambia pelicula/sesion para evitar incoherencias.
// Limpia asientos, tienda y confirmacion previa.
function resetOrderProgress(): void {
  selectedSeats.clear();
  selectedSnacks = new Map<string, number>();
  receiptEmail = "";
  renderSeatGrid();
  renderSeatSummary();
  renderSnackCatalog();
  renderCheckoutSummary();
  updateConfirmation();
}

// Valida formato MM/AA y que la tarjeta no este vencida respecto a la fecha actual.
function isFutureExpiry(value: string): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  return year > currentYear || (year === currentYear && month >= currentMonth);
}

// Listener de cartelera.
// Este bloque centraliza dos acciones de UI:
// 1) select-movie: seleccion manual de una pelicula (sin fijar sesion).
// 2) select-session: seleccion directa de pelicula + idioma + horario.
// En ambos casos, si hubo cambios reales, reiniciamos progreso para evitar
// inconsistencias entre sesion antigua, asientos y checkout.
movieCatalog.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest<HTMLButtonElement>("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const title = button.dataset.movieTitle;
  const movie = MOVIES.find((item) => item.title === title);
  if (!movie) {
    return;
  }

  if (action === "select-movie") {
    const changed = selectedMovie?.title !== movie.title;
    selectedMovie = movie;
    selectedLanguage = "";
    selectedTime = "";
    if (changed) {
      resetOrderProgress();
    }
    renderMovieCatalog();
    renderSelectionSummary();
    updateRoomInfo();
    setStep(1);
  } else if (action === "select-session") {
    const language = button.dataset.language as Language;
    const time = button.dataset.time ?? "";
    const changed =
      selectedMovie?.title !== movie.title ||
      selectedLanguage !== language ||
      selectedTime !== time;

    selectedMovie = movie;
    selectedLanguage = language;
    selectedTime = time;
    if (changed) {
      resetOrderProgress();
    }
    renderMovieCatalog();
    renderSelectionSummary();
    updateRoomInfo();
    syncStepAccess();
  } else {
    return;
  }
});

// Boton principal de avance del paso 1 al paso 2.
// Se permite avanzar solo cuando el usuario completo pelicula + idioma + horario.
toStep2Btn.addEventListener("click", () => {
  if (!isStep1Complete()) {
    window.alert("Debes seleccionar pelicula, idioma y horario para continuar.");
    return;
  }
  setStep(2);
  stepCards[1].scrollIntoView({ behavior: "smooth", block: "center" });
});

// Interaccion sobre la rejilla de asientos.
// Flujo:
// 1) validar que el paso 1 este completo,
// 2) validar que el objetivo del click sea un asiento valido y libre,
// 3) alternar seleccion (toggle),
// 4) refrescar resumenes y checkout.
seatGrid.addEventListener("click", (event) => {
  if (!isStep1Complete()) {
    window.alert("Primero debes completar pelicula, idioma y horario.");
    setStep(1);
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const seatId = target.dataset.seatId;
  if (!seatId) {
    return;
  }

  const seatPosition = getSeatPositionFromId(seatId);
  if (!seatPosition || seatMatrix[seatPosition.row][seatPosition.col] === 1) {
    return;
  }

  if (selectedSeats.has(seatId)) {
    selectedSeats.delete(seatId);
  } else {
    selectedSeats.add(seatId);
  }

  renderSeatGrid();
  renderSeatSummary();
  renderCheckoutSummary();
  syncStepAccess();
});

// Avance del paso 2 al paso 3.
// Exige que exista al menos una butaca seleccionada y, ademas,
// informa por consola sobre el primer par de asientos contiguos libres.
toStep3Btn.addEventListener("click", () => {
  if (!isStep1Complete()) {
    window.alert("Debes completar primero pelicula, idioma y horario.");
    setStep(1);
    return;
  }
  if (!isStep2Complete()) {
    window.alert("Debes seleccionar al menos un asiento.");
    return;
  }

  const contiguous = findFirstAdjacentFreeSeats(seatMatrix);
  console.info(contiguous.message);
  setStep(3);
  stepCards[2].scrollIntoView({ behavior: "smooth", block: "center" });
});

// Listener unico para botones +/- de tienda.
// Usa data attributes para identificar producto y accion sin listeners por tarjeta.
snackCatalog.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest<HTMLButtonElement>("button[data-action][data-snack-id]");
  if (!button) {
    return;
  }

  const snackId = button.dataset.snackId ?? "";
  const action = button.dataset.action;
  const currentQty = selectedSnacks.get(snackId) ?? 0;

  if (action === "inc-snack") {
    selectedSnacks.set(snackId, currentQty + 1);
  } else if (action === "dec-snack") {
    const nextQty = Math.max(0, currentQty - 1);
    if (nextQty === 0) {
      selectedSnacks.delete(snackId);
    } else {
      selectedSnacks.set(snackId, nextQty);
    }
  } else {
    return;
  }

  renderSnackCatalog();
  renderCheckoutSummary();
});

// Botones de retroceso para revisar y modificar decisiones previas del flujo.
backToStep1Btn.addEventListener("click", () => {
  setStep(1);
  stepCards[0].scrollIntoView({ behavior: "smooth", block: "center" });
});

backToStep2Btn.addEventListener("click", () => {
  setStep(2);
  stepCards[1].scrollIntoView({ behavior: "smooth", block: "center" });
});

backToStep3Btn.addEventListener("click", () => {
  setStep(3);
  stepCards[2].scrollIntoView({ behavior: "smooth", block: "center" });
});

// Boton Home del main: acceso rapido al paso 1 desde cualquier punto.
goHomeMainBtn.addEventListener("click", () => {
  setStep(1);
  stepCards[0].scrollIntoView({ behavior: "smooth", block: "center" });
});

// Submit del formulario de pago.
// Pipeline completo:
// 1) validar prerequisitos de pasos previos,
// 2) validar campos de tarjeta y email,
// 3) reservar definitivamente cada asiento en la matriz,
// 4) recalcular estado global de sala,
// 5) pasar a confirmacion final con recibo.
paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  hidePaymentError();

  const formData = new FormData(paymentForm);
  const cardName = String(formData.get("cardName") ?? "").trim();
  const cardNumberRaw = String(formData.get("cardNumber") ?? "").replace(/\s+/g, "");
  const expiry = String(formData.get("expiry") ?? "").trim();
  const cvv = String(formData.get("cvv") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!isStep1Complete() || !selectedMovie) {
    showPaymentError("Completa primero pelicula, idioma y horario.");
    setStep(1);
    return;
  }
  if (!isStep2Complete()) {
    showPaymentError("Selecciona al menos un asiento en el paso 2.");
    setStep(2);
    return;
  }
  if (cardName.length < 3) {
    showPaymentError("El titular de la tarjeta no es valido.");
    return;
  }
  if (!/^\d{16}$/.test(cardNumberRaw)) {
    showPaymentError("El numero de tarjeta debe tener 16 digitos.");
    return;
  }
  if (!isFutureExpiry(expiry)) {
    showPaymentError("La fecha de caducidad no es valida o ya vencio.");
    return;
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    showPaymentError("El CVV debe tener 3 o 4 digitos.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showPaymentError("Introduce un email valido para enviar el recibo.");
    return;
  }

  const reserveMessages: string[] = [];
  for (const seatId of selectedSeats) {
    const position = getSeatPositionFromId(seatId);
    if (!position) {
      showPaymentError(`Error al reservar el asiento ${seatId}.`);
      return;
    }
    const reservation = reserveSeat(seatMatrix, position.row, position.col);
    reserveMessages.push(reservation.message);
    if (!reservation.success) {
      showPaymentError(reservation.message);
      return;
    }
  }

  reserveMessages.forEach((message) => console.info(message));
  const totals = countSeats(seatMatrix);
  console.info(`Estado de sala -> ocupados: ${totals.occupied}, libres: ${totals.available}.`);
  printSeatMatrix(seatMatrix);

  receiptEmail = email;
  setStep(4);
  updateConfirmation();
  stepCards[3].scrollIntoView({ behavior: "smooth", block: "center" });
});

// Accion de perfil simulada (placeholder funcional).
profileBtn.addEventListener("click", () => {
  window.alert("Area de perfil en construccion.");
});

// Boot sequence de la aplicacion:
// inicializa render de todos los modulos y sincroniza estado visual.
renderFlow();
renderMovieCatalog();
renderSelectionSummary();
updateRoomInfo();
renderSeatGrid();
renderSeatSummary();
renderSnackCatalog();
renderCheckoutSummary();
renderCardHighlights();
syncStepAccess();
syncCardVisibility();
updateConfirmation();

// Trazas iniciales de consola para soporte operativo del personal del cine.
console.info("Estado inicial de la sala:");
printSeatMatrix(seatMatrix);
console.info(findFirstAdjacentFreeSeats(seatMatrix).message);
console.log("Matriz de asientos (array 2D):", seatMatrix);