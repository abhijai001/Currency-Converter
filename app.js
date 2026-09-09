const BASE_URL = "https://api.frankfurter.dev/v2/rate";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Populate currency dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}


// Get exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = Number(amount.value);

  if (amount.value === "" || amtVal < 1 || isNaN(amtVal)) {
    amtVal = 1;
    amount.value = "1";
  }

  // Example:
  // https://api.frankfurter.dev/v2/rate/USD/INR

  const URL = `${BASE_URL}/${fromCurr.value}/${toCurr.value}`;

  try {
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    let data = await response.json();

    let rate = data.rate;

    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "Unable to get exchange rate";
  }
};


// Update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");

  img.src = newSrc;
};


// Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});


// Run when page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});