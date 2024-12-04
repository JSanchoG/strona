const Toast = Swal.mixin({
  toast: true,
  position: "bottom",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

let allowHalf;
if (localStorage.getItem("allowHalf") !== null)
  allowHalf = localStorage.getItem("allowHalf") === "true";
else {
  allowHalf = true;
  localStorage.setItem("allowHalf", allowHalf);
}

const triangleA = document.getElementById("triangleA");
const triangleB = document.getElementById("triangleB");
const outputRa = document.getElementById("Ra");
const outputRb = document.getElementById("Rb");

const lengthInput = document.getElementById("length");
const massInput = document.getElementById("mass");
const XaInput = document.getElementById("Xa");
const XbInput = document.getElementById("Xb");

const belkaWidth = 600; // px

let g;
if (localStorage.getItem("g") !== null)
  g = parseFloat(localStorage.getItem("g"));
else {
  g = 9.81;
  localStorage.setItem("g", g);
}

let isDraggingA = false;
let isDraggingB = false;
let dragOffsetA = 0; // przesunięcie A
let dragOffsetB = 0; // przesunięcie B

function liczenieBelki(m, L, Xa, Xb) {
  const F = m * g;

  // nie dziel przez 0, gdy Xa==Xb
  if (Xa === Xb) return { Ra: F / 2, Rb: F / 2 }; // równomierne obciążenie, gdy Xa == Xb

  const Rb = (F * (L / 2 - Xa)) / (L - Xa - Xb);
  const Ra = F - Rb;

  return { Ra: Ra, Rb: Rb };
}

// Update max values for Xa and Xb
function updateMaxXaXb() {
  const length = parseFloat(document.getElementById("length").value);
  const halfLength = length / 2;

  const Xa = document.getElementById("Xa");
  const Xb = document.getElementById("Xb");

  Xa.max = allowHalf ? halfLength : halfLength - 0.01;
  Xb.max = allowHalf ? halfLength : halfLength - 0.01;
}

// walidacja
function validateInput(input) {
  const value = parseFloat(input.value);

  if (isNaN(value) || value < 0) {
    input.value = 1; // Ustaw na 1, gdy wartość jest ujemna lub pusta
    updatePozycje();
    updateBelkaLabels();
    return "Wartość nie może być mniejsza od 0. Ustawiono na 1.";
  }

  const maxValue = parseFloat(input.max);
  if (value > maxValue) {
    input.value = maxValue.toFixed(2);
    updatePozycje();
    return `Wartość nie może być większa od ${maxValue.toFixed(2)}.`;
  }

  return "";
}

// walidacja masy i długości
function checkMassAndLength() {
  let error = validateInput(massInput);
  if (error) Toast.fire({ icon: "error", title: error });

  error = validateInput(lengthInput);
  if (error) Toast.fire({ icon: "error", title: error });
  checkXaXbValue();
}

function checkXaXbValue() {
  const length = parseFloat(document.getElementById("length").value);

  const Xa = document.getElementById("Xa");
  const Xb = document.getElementById("Xb");

  let error = validateInput(Xa);
  if (error) Toast.fire({ icon: "error", title: error });

  error = validateInput(Xb);
  if (error) Toast.fire({ icon: "error", title: error });

  const XaPosition = (parseFloat(Xa.value) / length) * belkaWidth;
  const XbPosition = belkaWidth - (parseFloat(Xb.value) / length) * belkaWidth;
  triangleA.style.left = `${XaPosition}px`;
  triangleB.style.left = `${XbPosition}px`;
}

document.getElementById("Xa").addEventListener("blur", checkXaXbValue);
document.getElementById("Xb").addEventListener("blur", checkXaXbValue);

massInput.addEventListener("blur", checkMassAndLength);
lengthInput.addEventListener("blur", checkMassAndLength);

function updatePozycje() {
  const L = parseFloat(lengthInput.value);
  const Xa =
    !allowHalf && parseFloat(XaInput.value) == L / 2
      ? parseFloat(XaInput.value) - 0.01
      : parseFloat(XaInput.value);

  const Xb =
    !allowHalf && parseFloat(XbInput.value) == L / 2
      ? parseFloat(XbInput.value) - 0.01
      : parseFloat(XbInput.value);
  const m = parseFloat(massInput.value);

  const XaPosition = (Xa / L) * belkaWidth;
  const XbPosition = belkaWidth - (Xb / L) * belkaWidth;

  triangleA.style.left = `${XaPosition}px`;
  triangleB.style.left = `${XbPosition}px`;

  const wyniki = liczenieBelki(m, L, Xa, Xb);
  outputRa.textContent = isNaN(wyniki.Ra) ? "0" : wyniki.Ra.toFixed(2);
  outputRb.textContent = isNaN(wyniki.Rb) ? "0" : wyniki.Rb.toFixed(2);
  updateTriangleContents();
}

function updateXaFromPosition(position) {
  const L = parseFloat(lengthInput.value);
  const maxXa = allowHalf ? L / 2 : L / 2 - 0.01;
  const newXa = (position / belkaWidth) * L;
  if (newXa <= maxXa) {
    XaInput.value = newXa.toFixed(2);
    updatePozycje();
  }
}

function updateXbFromPosition(position) {
  const L = parseFloat(lengthInput.value);
  const maxXb = allowHalf ? L / 2 : L / 2 - 0.01;
  const newXb = (position / belkaWidth) * L;
  if (newXb <= maxXb) {
    XbInput.value = newXb.toFixed(2);
    updatePozycje();
  }
}

function preventSelection(event) {
  event.preventDefault();
}

let maxXhalf = allowHalf
  ? parseFloat(lengthInput.value) / 2
  : parseFloat(lengthInput.value) / 2 - 0.01;
// Trójkąt A
triangleA.addEventListener("mousedown", function (event) {
  isDraggingA = true;
  const triangleRect = triangleA.getBoundingClientRect();
  dragOffsetA = event.clientX - triangleRect.left;
  document.addEventListener("selectstart", preventSelection);
});
document.addEventListener("mousemove", function (event) {
  if (!isDraggingA) return;
  const belkaRect = document
    .querySelector(".belka-container")
    .getBoundingClientRect();
  let position = event.clientX - belkaRect.left - dragOffsetA;
  position = Math.max(
    0,
    Math.min(position, (maxXhalf / parseFloat(lengthInput.value)) * belkaWidth)
  );
  updateXaFromPosition(position);
});

// Trójkąt B
triangleB.addEventListener("mousedown", function (event) {
  isDraggingB = true;
  const triangleRect = triangleB.getBoundingClientRect();
  dragOffsetB = event.clientX - triangleRect.left;
  document.addEventListener("selectstart", preventSelection);
});
document.addEventListener("mousemove", function (event) {
  if (!isDraggingB) return;
  const belkaRect = document
    .querySelector(".belka-container")
    .getBoundingClientRect();
  let position = belkaRect.right - event.clientX + dragOffsetB;
  position = Math.max(
    0,
    Math.min(position, (maxXhalf / parseFloat(lengthInput.value)) * belkaWidth)
  );
  updateXbFromPosition(position);
});

document.addEventListener("mouseup", function () {
  isDraggingA = false;
  isDraggingB = false;
  document.removeEventListener("selectstart", preventSelection);
});

massInput.addEventListener("input", updatePozycje);
lengthInput.addEventListener("input", () => {
  updateMaxXaXb();
  updatePozycje();
});
XaInput.addEventListener("input", updatePozycje);
XbInput.addEventListener("input", updatePozycje);

function updateBelkaLabels() {
  const length = lengthInput.value;
  const mass = massInput.value;
  document.querySelector(".length-label").textContent = `${length}m`;
  document.querySelector(".mass-label").textContent = `${mass}kg`;
}

lengthInput.addEventListener("input", () => {
  updateMaxXaXb();
  updatePozycje();
  updateBelkaLabels();
});

massInput.addEventListener("input", () => {
  updatePozycje();
  updateBelkaLabels();
});

function updateTriangleContents() {
  const Xa = parseFloat(XaInput.value);
  const Xb = parseFloat(XbInput.value);
  document
    .querySelector(".tA")
    .style.setProperty("--contentA", `"${Xa.toFixed(2)}"`);
  document
    .querySelector(".tB")
    .style.setProperty("--contentB", `"${Xb.toFixed(2)}"`);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "g" || event.key === "G") gKeyDown();
});

const infoButton = document.getElementById("infoButton");
infoButton.addEventListener("click", () => {
  Swal.fire({
    icon: "info",
    html: "Wprowadź masę (kg), długość (m) oraz odległości Xa i Xb, które muszą być większe od 0. Program obliczy siły reakcyjne Ra i Rb na końcach belki, uwzględniając równowagę sił i momentów. Możesz przesuwać trójkąty reprezentujące Xa i Xb w interaktywnym widoku, aby zobaczyć wpływ na siły. Upewnij się, że Xa i Xb nie przekraczają połowy długości belki.<br><br>Przycisk <b>H</b> odblokuje możliwość przesunięcia X<sub>A</sub> oraz X<sub>B</sub> do połowy, co może powodować błędy w niektórych obliczeniach.",
    showDenyButton: true,
    denyButtonText: "H",
    denyButtonColor: allowHalf ? "#008000" : "#BE0000",
    showCancelButton: true,
    confirmButtonText: "Ustaw wartość g",
    cancelButtonText: "Zamknij",
  }).then((result) => {
    if (result.isConfirmed) gKeyDown();
    else if (result.isDenied) {
      allowHalf = !allowHalf;
      localStorage.setItem("allowHalf", allowHalf);
      maxXhalf = allowHalf
        ? parseFloat(lengthInput.value) / 2
        : parseFloat(lengthInput.value) / 2 - 0.01;
      updateMaxXaXb();
      updatePozycje();
      if (!allowHalf) {
        let tA = parseFloat(
          document
            .querySelector(".tA")
            .style.getPropertyValue("--contentA")
            .replaceAll(`"`, "")
        );
        if (tA == lengthInput.value / 2) {
          tA = tA - 0.01;
          document
            .querySelector(".tA")
            .style.setProperty("--contentA", `"${tA.toFixed(2)}"`);
        }
        let tB = parseFloat(
          document
            .querySelector(".tB")
            .style.getPropertyValue("--contentB")
            .replaceAll(`"`, "")
        );
        if (tB == lengthInput.value / 2) {
          tB = tB - 0.01;
          document
            .querySelector(".tB")
            .style.setProperty("--contentB", `"${tB.toFixed(2)}"`);
        }
      }
    }
  });
});

function gKeyDown() {
  Swal.fire({
    title: "Ustaw wartość g",
    html: `${
      g == 9.81 ? "" : "Wartość domyślna: 9.81<br>"
    }Wartość bieżąca: <b>${g}</b>`,
    footer: `Kliknij, aby ustawić wartość: <u><b><span style="cursor:pointer" onclick="localStorage.setItem('g', 9.81); g=9.81; gValueSet(g)">9.81</span></b></u> | <u><b><span style="cursor:pointer" onclick="localStorage.setItem('g', 10); g=10; gValueSet(g)">10</span></b></u>`,
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Potwierdź",
    cancelButtonText: "Anuluj",
    preConfirm: (value) => {
      let parsedValue = value == "g" ? "g" : parseFloat(value);
      if (value !== "g" && (isNaN(parsedValue) || parsedValue <= 0)) {
        Swal.showValidationMessage(`Wartość musi być liczbą większą od 0.`);
        return false;
      }
      if (parsedValue == "g") parsedValue = 9.81;
      g = parsedValue;
      localStorage.setItem("g", parsedValue);
      return parsedValue;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) gValueSet(result.value);
  });
}

function gValueSet(g) {
  updatePozycje();
  Swal.fire({
    title: `g = ${g}`,
    icon: "success",
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

function toggleBackgroundMode() {
  const body = document.body;
  if (body.classList.contains("default-mode")) {
    body.classList.remove("default-mode");
    body.classList.add("gradient-mode");
    localStorage.setItem("backgroundMode", "gradient-mode");
  } else {
    body.classList.remove("gradient-mode");
    body.classList.add("default-mode");
    localStorage.setItem("backgroundMode", "default-mode");
  }
}

function loadBackgroundMode() {
  const storedMode = localStorage.getItem("backgroundMode");
  storedMode
    ? document.body.classList.add(storedMode)
    : document.body.classList.add("default-mode");
}
document.addEventListener("keydown", function (event) {
  if (event.key === "q" || event.key === "Q") toggleBackgroundMode();
});
window.onload = loadBackgroundMode;

updatePozycje();
updateMaxXaXb();
updateBelkaLabels();
