"use strict";

let film = {
  name: "Lord Of The Ring",
  director: "Piter Jackson",
  year: 2001,
  oscar: true,
  rate: 5
};

// Elements for Show and Hide blocks
let elem = document.getElementById("editFilm");
let elem2 = document.getElementById("yourFilm");

function editFavoriteFilm() {
  elem.style.display = "block";
  elem2.style.display = "none";
}

function saveFavoriteFilm() {
  let form = document.formFilm;

  film.name = form.name.value;
  film.director = form.director.value;
  film.year = form.year.value;
  film.rate = form.rate.value;

  let hasOscar = form.oscarYes.checked;

  film.oscar = hasOscar ? true : false;
}

function saveAndShow() {
  saveFavoriteFilm();
  return showFavoriteFilm();
}

function showFavoriteFilm() {
  elem.style.display = "none";
  elem2.style.display = "block";

  return `<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Options</th>
      <th scope="col">Film</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Your favorite film is</td>
      <td class="font-weight-bold">${film.name}</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Director</td>
      <td class="font-weight-bold">${film.director}</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Year of the film</td>
      <td class="font-weight-bold">${film.year}</td>
    </tr>
    <tr>
      <th scope="row">4</th>
      <td>Oscars</td>
      <td class="font-weight-bold">${film.oscar}</td>
    </tr>
    <tr>
      <th scope="row">5</th>
      <td>Rate of film max 5</td>
      <td class="font-weight-bold">${film.rate}</td>
    </tr>
  </tbody>
</table>`;
}
