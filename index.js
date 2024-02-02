document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndUpdateTable();
  startCountdown();
  setupToggleStyle();
});

async function fetchDataAndUpdateTable() {
  try {
    const response = await fetch("http://localhost:3000/cryptoData");
    const data = await response.json();
    console.log(data);
    updateTableWithData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function updateTableWithData(data) {
  const tableBody = document.getElementById("cryptoTableBody");
  const body = document.querySelector("body");
  function formatNumberWithCommas(number) {
    if (number > 10000) number = number.toFixed(0);
    else number = number.toFixed(3);
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  tableBody.innerHTML = "";

  data.forEach((crypto, index) => {
    const row = document.createElement("tr");
    row.classList.add("table-row");

    const numberCell = document.createElement("td");
    numberCell.textContent = index + 1;
    numberCell.classList.add("number-cell");
    row.appendChild(numberCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = crypto.name;
    row.appendChild(nameCell);

    const lastCell = document.createElement("td");
    lastCell.textContent = "₹ " + formatNumberWithCommas(crypto.last);
    row.appendChild(lastCell);

    const buySellCell = document.createElement("td");
    buySellCell.textContent =
      "₹ " +
      ` ${formatNumberWithCommas(crypto.buy)} / ₹ ${formatNumberWithCommas(
        crypto.sell
      )}`;
    row.appendChild(buySellCell);

    const volumeCell = document.createElement("td");
    volumeCell.textContent = crypto.volume;
    row.appendChild(volumeCell);

    const baseUnitCell = document.createElement("td");
    baseUnitCell.textContent = crypto.base_unit;
    baseUnitCell.classList.add("base-cell");
    row.appendChild(baseUnitCell);

    tableBody.appendChild(row);
  });
  const tableRows = document.querySelectorAll(".table-row");
  if (body.style.backgroundColor === "white") {
    tableRows.forEach((row) => {
      row.style.backgroundColor = "#dcdfe2";
      row.style.color = "#191d28";
      row.style.fontSize = "16px";
      row.style.letterSpacing = "0.5px";
    });
  }
}

function setupToggleStyle() {
  const toggleButton = document.getElementById("toggleButton");
  const body = document.querySelector("body");
  const INR = document.querySelector(".INR");
  const BTC = document.querySelector(".BTC");
  const cryptoLink = document.querySelector(".crypto-link");
  const cryptoBtn = document.querySelector(".BuyCrypto");
  const heading = document.querySelector(".heading");

  toggleButton
    .querySelector('input[type="checkbox"]')
    .addEventListener("change", function () {
      const tableRows = document.querySelectorAll(".table-row");
      if (body.style.backgroundColor === "white") {
        body.style.backgroundColor = "#191d28";
        INR.style.color = "white";
        INR.style.backgroundColor = "#2e3241";
        heading.style.color = "white";
        BTC.style.color = "white";
        BTC.style.backgroundColor = "#2e3241";
        cryptoLink.style.color = "white";
        cryptoBtn.style.backgroundColor = "#2e3241";

        tableRows.forEach((row) => {
          row.style.color = "white";
          row.style.backgroundColor = "#343542";
          row.style.fontSize = "1.5rem";
        });
      } else {
        body.style.backgroundColor = "white";
        INR.style.color = "#2e3241";
        INR.style.backgroundColor = "rgb(234, 234, 234)";
        BTC.style.color = "#2e3241";
        BTC.style.backgroundColor = "rgb(234, 234, 234)";
        cryptoLink.style.color = "#2e3241";
        heading.style.color = "#2e3241";
        cryptoBtn.style.backgroundColor = "rgb(234, 234, 234)";
        tableRows.forEach((row) => {
          row.style.backgroundColor = "#dcdfe2";
          row.style.color = "#191d28";
          row.style.fontSize = "16px";
          row.style.letterSpacing = "0.5px";
        });
      }
    });
}

function startCountdown() {
  const countdownSpan = document.getElementById("countdown");
  let count = 59;
  function updateCountdown() {
    countdownSpan.textContent = count;

    count--;
    if (count === -1) {
      count = 59;
    }
  }
  setInterval(updateCountdown, 1000);
  setInterval(fetchDataAndUpdateTable, 60000);
  updateCountdown();
}
