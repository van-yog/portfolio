"use strict";
const ONE_YEAR = 1;
let period = ONE_YEAR;

let flight = {};

// Set Min Max value of inputs data - min value is current date max current date + period
setMinMaxDateForInput('input[name="flightDepart"]');
setMinMaxDateForInput('input[name="flightReturn"]');

//find our form with flight information
let f = document.forms.flight__form;

let btnSearch = f.flightSearch;
let flightDepart = f.flightDepart;
let flightReturn = f.flightReturn;

let oneWay = document.querySelector("#flight__oneWay");
let baggage = f.flightBaggage;
let ticketInfo = document.querySelector("#ticket");
console.log(ticketInfo);

f.addEventListener("change", () => {
  tempInformation(flight);

  flightReturn.disabled = oneWay.checked ? true : false;

  let ticketInfo = document.querySelector(".find-ticket");
  if (ticketInfo) {
    ticketInfo.classList.remove("find-ticket");
    let p = document.querySelector(".bold");
    p.innerHTML = "Temp information about your flight";
  }
});

baggage.addEventListener("click", () => {
  let smallCount = document.querySelector("#countBaggage");
  let weight = document.querySelector("#totalWeight");

  if (baggage.value) {
    smallCount.innerHTML = baggage.value;
    weight.innerHTML = baggage.value * 20;
  }
});

flightDepart.addEventListener("change", () => {
  flightReturn.min = flightDepart.value;
});

btnSearch.addEventListener("click", () => {
  if (!validateForm()) {
    alert("Please enter all data");
    return;
  }

  findTicket();
});

function setMinMaxDateForInput(input) {
  let dateControl = document.querySelector(input);
  let dateCurrent = new Date();

  dateControl.min = getDateForInput(dateCurrent);
  dateControl.max = getMaxDateForInput(dateCurrent, period);
}

function getDateForInput(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1; //getMonth return from 0 to 11, where 0 - it's mean January, 11 - December
  let day = date.getDate();
  let dateForInput;

  if (month < 10) {
    month = "0" + month; //month must start from 0
  }
  if (day < 10) {
    day = "0" + day; //day must start from 0
  }

  dateForInput = `${year}-${month}-${day}`; //it's format of value to <input type:'date'>
  return dateForInput;
}

function getMaxDateForInput(date, period) {
  if (period > 2) {
    //rule of the Air Company, that sell tickes - MAX period 2 years
    period = 2;
  }
  let maxYear = date.getFullYear() + period;
  date.setFullYear(maxYear);
  return getDateForInput(date);
}

function tempInformation(flight) {
  document.querySelector("#ticket__from").innerText = flight.from =
    f.flightFrom.value;
  document.querySelector("#ticket__to").innerText = flight.to =
    f.flightTo.value;
  document.querySelector("#ticket__depart").innerText = flight.depart =
    f.flightDepart.value;
  document.querySelector("#ticket__return").innerText = flight.return =
    f.flightReturn.value;
  document.querySelector("#ticket__adults").innerText = flight.adults = Number(
    f.flightAdults.value
  );
  document.querySelector(
    "#ticket__children"
  ).innerText = flight.children = Number(f.flightChildren.value);
  document.querySelector(
    "#ticket__baggage"
  ).innerText = flight.baggage = Number(f.flightBaggage.value);

  document.querySelector("#ticket__weight").innerText = flight.weight = Number(
    flight.baggage * 20
  );

  if (oneWay.checked) {
    document
      .querySelector("#ticket__return")
      .parentElement.classList.add("close");
  } else {
    document
      .querySelector("#ticket__return")
      .parentElement.classList.remove("close");
  }
}

function validateForm() {
  console.log(flight);
  if (!flight) return false;
  if (!flight.from || !flight.to) {
    return false;
  }

  if (!flight.adults && !flight.children) {
    return false;
  }

  if (oneWay.checked) {
    console.log("Ticket only in one side");
    if (!flight.depart) {
      console.log("Enter depart date");
      console.log(flight.depart);
      return false;
    }
  } else {
    console.log("Ticken with return flight");
    if (!flight.return || !flight.depart) {
      console.log("Enter all dates for your travel");
      return false;
    }
  }
  return true;
}

function findTicket() {
  let ticket = document.querySelector("#ticket");
  ticket.classList.add("find-ticket");
  let p = document.querySelector(".bold");
  p.innerHTML = "We find to you ticket";
}
