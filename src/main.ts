import "./style.css";

// Tipos nucleares del modulo: idioma y entidades del dominio.
type Language = "VOSE" | "Castellano";

// Datos adicionales en estructura JSON-compatible, sin objetos personalizados.
// Movie: [titulo, poster, genero, etiquetas, sinopsis, director, reparto, sala, sesionesVOSE, sesionesCastellano]
type Movie = [string, string, string, string[], string, string, string[], number, string[], string[]];

// Snack: [id, nombre, imagen, descripcion, precio]
type Snack = [string, string, string, string, number];

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

// Cartelera principal en formato JSON-compatible.
// Cada fila: [titulo, poster, genero, etiquetas, sinopsis, director, reparto, sala, sesionesVOSE, sesionesCastellano].
const MOVIES = ([
  [
    "Cartas al Mar",
    "/img_ref/MOVIES/CARTASL_AL_MAR.webp",
    "Drama romantico",
    ["Intimo", "Emotivo", "Nostalgico"],
    "Una restauradora de cartas antiguas descubre una correspondencia perdida que la conecta con una historia de amor inacabada frente al mar Cantabrico.",
    "Lucia Varela",
    ["Ines Cebrian", "Javier Montero", "Paula Requena"],
    2,
    ["16:10", "19:00", "21:40"],
    ["17:25", "20:15"]
  ],
  [
    "Eclipse de Titan",
    "/img_ref/MOVIES/ECLIPSE_DE_TITAN.webp",
    "Ciencia ficcion",
    ["Espacial", "Suspense", "Aventura"],
    "Una tripulacion cientifica llega a Titan y detecta una senal imposible que podria reescribir el origen de la vida en el sistema solar.",
    "Arturo Navas",
    ["Clara Duenas", "Mateo Vidal", "Izan Salvat"],
    5,
    ["15:50", "18:35", "21:20", "23:40"],
    ["16:40", "19:25", "22:10"]
  ],
  [
    "El Reino de Ceniza",
    "/img_ref/MOVIES/EL_REINO_DE_CENIZA.webp",
    "Fantasia epica",
    ["Magia", "Accion", "Aventura"],
    "Una heredera desterrada cruza tierras arrasadas para reunir a tres clanes y enfrentarse al regente que gobierna mediante fuego y miedo.",
    "Sergio Alaminos",
    ["Nora Beltran", "Adrian Funes", "Leire Rosales"],
    1,
    ["17:00", "20:00"],
    ["15:30", "18:30", "21:30"]
  ],
  [
    "La Casa del Silencio",
    "/img_ref/MOVIES/LA%20CASA%20DEL%20SILENCIO.webp",
    "Terror psicologico",
    ["Terror", "Misterio", "Thriller"],
    "Una familia se muda a una mansion donde el sonido desaparece cada medianoche, mientras una presencia exige ser escuchada a traves del silencio.",
    "Helena Cortes",
    ["Diego Ariza", "Marta Lozano", "Eric Mena"],
    4,
    ["19:10", "22:00"],
    ["18:00", "20:50", "23:20"]
  ],
  [
    "Robo en la Gran Via",
    "/img_ref/MOVIES/ROBO_EN_LA_GRAN_VIA.webp",
    "Comedia de atracos",
    ["Comedia", "Heist", "Urbano"],
    "Un grupo de extras de cine planea el golpe perfecto durante un rodaje nocturno en Madrid, pero cada improvisacion complica mas el plan.",
    "Pablo Escudero",
    ["Rocio Lara", "Alvaro Campos", "Sofia Naranjo"],
    3,
    ["16:20", "19:35"],
    ["17:10", "20:25", "22:45"]
  ]
] as Movie[]).sort((a, b) => movieTitle(a).localeCompare(movieTitle(b), "es"));

// Catalogo de tienda en formato JSON-compatible.
// Cada fila: [id, nombre, imagen, descripcion, precio].
const SNACKS = [
  ["clasico", "Combo Clasico", "/img_ref/MENUS/COMBO_CLASICO.webp", "Palomitas medianas + bebida + gominolas.", 8.5],
  ["dulce", "Combo Dulce", "/img_ref/MENUS/COMBO_DULCE.webp", "Palomitas dulces + chocolatinas + refresco.", 9.2],
  ["familiar", "Combo Familiar", "/img_ref/MENUS/COMBO_FAMILIAR.webp", "Cubo grande de palomitas + 2 bebidas + surtido.", 14.9],
  ["nachos", "Combo Nachos", "/img_ref/MENUS/COMBO_NACHOS.webp", "Nachos con cheddar + palomitas + bebida.", 10.8],
  ["pareja", "Combo Pareja", "/img_ref/MENUS/COMBO_PAREJA.webp", "Palomitas grandes + 2 bebidas + golosinas.", 12.4]
] as Snack[];

function movieTitle(movie: Movie): string { return movie[0]; }
function moviePoster(movie: Movie): string { return movie[1]; }
function movieGenre(movie: Movie): string { return movie[2]; }
function movieTags(movie: Movie): string[] { return movie[3]; }
function movieSynopsis(movie: Movie): string { return movie[4]; }
function movieDirector(movie: Movie): string { return movie[5]; }
function movieActors(movie: Movie): string[] { return movie[6]; }
function movieRoom(movie: Movie): number { return movie[7]; }
function movieSessions(movie: Movie, language: Language): string[] { return language === "VOSE" ? movie[8] : movie[9]; }

function snackId(snack: Snack): string { return snack[0]; }
function snackName(snack: Snack): string { return snack[1]; }
function snackImage(snack: Snack): string { return snack[2]; }
function snackDescription(snack: Snack): string { return snack[3]; }
function snackPrice(snack: Snack): number { return snack[4]; }

// Geometria base de la sala.
const ROWS = 8;
const COLS = 10;

// Asientos ocupados al iniciar la app (estado simulado inicial).
const OCCUPIED_SEATS = ["C1", "D1", "F2", "B3", "I3", "E4", "H5", "A6", "D7", "G8"];

// Estado vivo de la experiencia de compra.
// Aqui se almacenan elecciones de usuario para navegar entre pasos.
let currentStep = 1;
let selectedMovie: Movie | null = null;
let selectedLanguage: Language | "" = "";
let selectedTime = "";
let selectedSnackQuantities: number[] = Array.from({ length: SNACKS.length }, () => 0);
let receiptEmail = "";
let reservationSeatsJson = "[]";

// Crea una matriz de asientos 8x10.
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

// Convierte una coordenada de matriz a un identificador de asiento.
// Regla de negocio: columnas A-J y filas 1-8 (ejemplo: A1, J8).
function seatIdFromPosition(row: number, col: number): string {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

// Convierte un identificador de asiento (A1..J8) en coordenadas [fila, columna].
function getSeatPositionFromId(seatId: string): [number, number] | null {
  const match = /^([A-J])(8|[1-7])$/.exec(seatId);
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

// Devuelve los identificadores de los asientos seleccionados leyendo solo la matriz 2D.
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

// Limpia la seleccion temporal leyendo solo la matriz 2D.
function clearSelectedSeats(matrix: number[][]): void {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (matrix[row][col] === 2) {
        matrix[row][col] = 0;
      }
    }
  }
}

// Muestra en consola la sala usando X para comprado, S para seleccionado y L para libre.
// Encabezado: columnas A-J. Filas: 1-8.
function printSeatMatrix(matrix: number[][]): void {
  const header = ["   ", ...Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i).padStart(2, " "))].join(" ");
  console.log(header);
  matrix.forEach((rowValues, rowIndex) => {
    const label = String(rowIndex + 1).padStart(2, " ");
    const rowText = rowValues.map((value) => (value === 1 ? " X" : value === 2 ? " S" : " L")).join(" ");
    console.log(`${label}  ${rowText}`);
  });
}

// Reserva un asiento por fila y columna con validacion y mensaje claro de resultado.
function reserveSeat(matrix: number[][], row: number, col: number): string {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
    return "Reserva fallida: posicion fuera de rango.";
  }
  if (matrix[row][col] === 1) {
    return `Reserva fallida: el asiento ${seatIdFromPosition(row, col)} ya esta ocupado.`;
  }
  matrix[row][col] = 1;
  return `Reserva confirmada: asiento ${seatIdFromPosition(row, col)}.`;
}

// Cuenta asientos ocupados, libres y seleccionados de toda la sala.
function countSeats(matrix: number[][]): [number, number, number] {
  let occupied = 0;
  let available = 0;
  let selected = 0;
  matrix.forEach((rowValues) => {
    rowValues.forEach((value) => {
      if (value === 1) {
        occupied += 1;
      } else if (value === 2) {
        selected += 1;
      } else {
        available += 1;
      }
    });
  });
  return [occupied, available, selected];
}

// Busca el primer par de asientos libres contiguos horizontalmente.
function findFirstAdjacentFreeSeats(matrix: number[][]): string {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS - 1; col += 1) {
      if (matrix[row][col] === 0 && matrix[row][col + 1] === 0) {
        const left = seatIdFromPosition(row, col);
        const right = seatIdFromPosition(row, col + 1);
        return `Asientos contiguos encontrados: ${left} y ${right}.`;
      }
    }
  }
  return "No hay asientos contiguos disponibles.";
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
  return getSelectedSeatIds(seatMatrix).length * TICKET_PRICE;
}

// Calcula el subtotal de tienda multiplicando precio por cantidad de cada combo.
function getSnacksSubtotal(): number {
  return SNACKS.reduce((total, snack, index) => total + snackPrice(snack) * selectedSnackQuantities[index], 0);
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
  return getSelectedSeatIds(seatMatrix).length > 0;
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
  return movieSessions(movie, language).map((time) => {
    const isActive = selectedMovie ? movieTitle(selectedMovie) === movieTitle(movie) : false && selectedLanguage === language && selectedTime === time;
    const style = isActive
      ? "border-sky-500 bg-sky-600 text-white"
      : "border-sky-200 bg-white text-sky-700 hover:border-sky-400";
    return `
      <button
        type="button"
        data-action="select-session"
        data-movie-title="${movieTitle(movie)}"
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
    const isSelectedMovie = selectedMovie ? movieTitle(selectedMovie) === movieTitle(movie) : false;
    const cardClass = isSelectedMovie
      ? "border-sky-500 bg-sky-100/80 ring-2 ring-sky-300"
      : "border-sky-200 bg-white";

    const tags = movieTags(movie)
      .map((tag) => `<span class="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700">${tag}</span>`)
      .join(" ");

    return `
      <article class="rounded-xl border p-3 transition ${cardClass}">
        <img src="${moviePoster(movie)}" alt="Poster de ${movieTitle(movie)}" class="aspect-[2/3] w-full rounded-lg object-cover" />
        <div class="mt-3 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-semibold text-slate-900">${movieTitle(movie)}</p>
            <span class="rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-semibold text-white">${movieGenre(movie)}</span>
          </div>
          <div class="flex flex-wrap gap-1">${tags}</div>
          <p class="text-xs text-slate-600">${movieSynopsis(movie)}</p>
          <p class="text-xs text-slate-700"><span class="font-semibold">Director:</span> ${movieDirector(movie)}</p>
          <p class="text-xs text-slate-700"><span class="font-semibold">Reparto:</span> ${movieActors(movie).join(", ")}</p>
          <p class="text-xs font-semibold text-sky-700">Sala ${movieRoom(movie)}</p>
          <button
            type="button"
            data-action="select-movie"
            data-movie-title="${movieTitle(movie)}"
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
    <p><span class="font-semibold text-sky-700">Pelicula:</span> ${movieTitle(selectedMovie)}</p>
    <p><span class="font-semibold text-sky-700">Genero:</span> ${movieGenre(selectedMovie)}</p>
    <p><span class="font-semibold text-sky-700">Idioma:</span> ${languageLabel}</p>
    <p><span class="font-semibold text-sky-700">Horario:</span> ${timeLabel}</p>
    <p><span class="font-semibold text-sky-700">Sala:</span> ${movieRoom(selectedMovie)}</p>
  `;
}

// Refleja en el paso 2 la sala asignada a la pelicula elegida.
function updateRoomInfo(): void {
  roomInfo.textContent = selectedMovie ? `Sala asignada: ${movieRoom(selectedMovie)}` : "Sala asignada: -";
}

// Muestra resumen de asientos seleccionados y metricas globales de ocupacion.
function renderSeatSummary(): void {
  const [occupied, available, selectedCount] = countSeats(seatMatrix);

  if (selectedCount === 0) {
    seatSummary.textContent = `Asientos -> ✓ Disponibles: ${available} | ✕ Comprados: ${occupied} | ○ Seleccionados: 0`;
    return;
  }

  seatSummary.textContent = `Asientos -> ✓ Disponibles: ${available} | ✕ Comprados: ${occupied} | ○ Seleccionados: ${selectedCount} | Entradas: ${formatEuro(getSeatSubtotal())}`;
}

// Devuelve clases visuales segun el codigo guardado en la matriz 2D.
function seatClass(state: number): string {
  if (state === 1) {
    return "cursor-not-allowed border-red-700 bg-red-600 text-white";
  } else if (state === 2) {
    return "border-emerald-700 bg-emerald-600 text-white";
  } else {
    return "border-slate-500 bg-slate-300 text-slate-900 hover:brightness-110";
  }
}

// Devuelve el simbolo visible de la butaca segun el codigo guardado en la matriz 2D.
function seatSymbol(state: number): string {
  if (state === 1) {
    return "✕";
  }
  if (state === 2) {
    return "○";
  }
  return "✓";
}

// Pinta la rejilla completa de asientos leyendo directamente la matriz 8x10 actual.
function renderSeatGrid(): void {

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
      const seatId = seatIdFromPosition(row, col);
      const seatState = seatMatrix[row][col];
      const disabled = seatState === 1 ? "disabled" : "";
      return `<button ${disabled} data-seat-id="${seatId}" title="${seatId}" aria-label="Asiento ${seatId}" class="inline-flex h-7 w-7 items-center justify-center rounded border text-sm font-semibold transition sm:h-8 sm:w-8 ${seatClass(seatState)}">${seatSymbol(seatState)}</button>`;
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
  snackCatalog.innerHTML = SNACKS.map((snack, index) => {
    const qty = selectedSnackQuantities[index];
    return `
      <article class="rounded-xl border border-sky-200 bg-white p-3">
        <img src="${snackImage(snack)}" alt="${snackName(snack)}" class="h-28 w-full rounded-lg object-cover" />
        <p class="mt-2 text-sm font-semibold text-slate-900">${snackName(snack)}</p>
        <p class="mt-1 text-xs text-slate-600">${snackDescription(snack)}</p>
        <p class="mt-1 text-xs font-semibold text-sky-700">${formatEuro(snackPrice(snack))}</p>
        <div class="mt-2 flex items-center gap-2">
          <button type="button" data-action="dec-snack" data-snack-index="${index}" class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-sky-300 bg-white text-sm font-semibold text-sky-700">-</button>
          <span class="min-w-6 text-center text-sm font-semibold text-slate-700">${qty}</span>
          <button type="button" data-action="inc-snack" data-snack-index="${index}" class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-sky-300 bg-white text-sm font-semibold text-sky-700">+</button>
        </div>
      </article>
    `;
  }).join("");
}

// Construye el checkout dinamico: entradas, tienda, subtotal, IVA y total final.
function renderCheckoutSummary(): void {
  const seatCount = getSelectedSeatIds(seatMatrix).length;
  const snacksCount = selectedSnackQuantities.reduce((sum, qty) => sum + qty, 0);
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
    .map((snack, index) => {
      const qty = selectedSnackQuantities[index];
      if (qty === 0) {
        return "";
      }
      return `<p><span class=\"text-sky-700\">${snackName(snack)}:</span> ${qty} x ${formatEuro(snackPrice(snack))}</p>`;
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

  const seats = (JSON.parse(reservationSeatsJson) as string[]).sort((a, b) => a.localeCompare(b));
  confirmationTitle.textContent = "Compra confirmada. Recibo enviado correctamente.";
  confirmationDetails.innerHTML = `
    <p><span class="text-sky-700">Pelicula:</span> ${movieTitle(selectedMovie)}</p>
    <p><span class="text-sky-700">Idioma:</span> ${selectedLanguage}</p>
    <p><span class="text-sky-700">Horario:</span> ${selectedTime}</p>
    <p><span class="text-sky-700">Sala:</span> ${movieRoom(selectedMovie)}</p>
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
  clearSelectedSeats(seatMatrix);
  selectedSnackQuantities = Array.from({ length: SNACKS.length }, () => 0);
  receiptEmail = "";
  reservationSeatsJson = "[]";
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
  const movie = MOVIES.find((item) => movieTitle(item) === title);
  if (!movie) {
    return;
  }

  if (action === "select-movie") {
    const changed = selectedMovie ? movieTitle(selectedMovie) !== movieTitle(movie) : true;
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
      selectedMovie ? movieTitle(selectedMovie) !== movieTitle(movie) : true ||
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
  if (!seatPosition || seatMatrix[seatPosition[0]][seatPosition[1]] === 1) {
    return;
  }

  const row = seatPosition[0];
  const col = seatPosition[1];
  seatMatrix[row][col] = seatMatrix[row][col] === 2 ? 0 : 2;

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

  console.info(findFirstAdjacentFreeSeats(seatMatrix));
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

  const button = target.closest<HTMLButtonElement>("button[data-action][data-snack-index]");
  if (!button) {
    return;
  }

  const snackIndex = Number(button.dataset.snackIndex ?? "-1");
  const action = button.dataset.action;
  if (snackIndex < 0 || snackIndex >= SNACKS.length) {
    return;
  }
  const currentQty = selectedSnackQuantities[snackIndex];

  if (action === "inc-snack") {
    selectedSnackQuantities[snackIndex] = currentQty + 1;
  } else if (action === "dec-snack") {
    selectedSnackQuantities[snackIndex] = Math.max(0, currentQty - 1);
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

  const selectedSeatIds = getSelectedSeatIds(seatMatrix);
  const reserveMessages: string[] = [];
  for (const seatId of selectedSeatIds) {
    const position = getSeatPositionFromId(seatId);
    if (!position) {
      showPaymentError(`Error al reservar el asiento ${seatId}.`);
      return;
    }
    const reservationMessage = reserveSeat(seatMatrix, position[0], position[1]);
    reserveMessages.push(reservationMessage);
    if (!reservationMessage.startsWith("Reserva confirmada")) {
      showPaymentError(reservationMessage);
      return;
    }
  }

  reservationSeatsJson = JSON.stringify(selectedSeatIds);
  reserveMessages.forEach((message) => console.info(message));
  const [occupied, available] = countSeats(seatMatrix);
  console.info(`Estado de sala -> ocupados: ${occupied}, libres: ${available}.`);
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
console.info(findFirstAdjacentFreeSeats(seatMatrix));
console.log("Matriz de asientos (array 2D):", seatMatrix);