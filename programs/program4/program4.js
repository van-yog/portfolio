"use strict";

let btnCard = document.querySelector("#btnCard");
let btnClear = document.querySelector("#btnClear");
let ul = document.querySelector("#ul-card");

btnCard.addEventListener("click", () => {
  console.log("btnCard");
  let name = document.forms.data.name.value;
  if (!name) name = "James";
  let surname = document.forms.data.surname.value;
  if (!surname) surname = "Bond";
  let type = document.forms.data.type.value;
  if (type === "RANDOM") {
    type = random();
    console.log("random");
  }
  let card = new Card(name, surname, type);
  createCard(card);
});

btnClear.addEventListener("click", () => {
  ul.innerText = "";
});

function Card(name, surname, type) {
  this.name = name;
  this.surname = surname;
  this.type = type;
  this.date = generateDate();
  this.cvv = generateCvv();
}

function generateDate() {
  let date = new Date();
  let year = date.getFullYear() + Math.floor(6 * Math.random());
  let month = Math.floor(12 * Math.random()) + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let endCard = `${month}/${year}`;
  console.log(endCard);
  return endCard;
}

function random() {
  let random = Math.random();
  if (random < 0.33) {
    return "VISA";
  } else if (random < 0.66) {
    return "MASTERCARD";
  } else return "MAESTRO";
}

function generateCvv() {
  let random = Math.random();
  let cvv = random.toString();

  cvv = cvv.slice(2, 5);
  return cvv;
}

function createCard(card) {
  let li = document.createElement("li");
  li.innerText = `Name: ${card.name}, Surname: ${card.surname}, Type: ${card.type}, End: ${card.date}, CVV: ${card.cvv}`;

  ul.append(li);
}
