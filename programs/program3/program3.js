let windowGame = document.querySelector(".window__game");
let shape = document.querySelector("#shape");
let checkbox = document.querySelector("#run");
let colorShape = document.querySelector("#color");

windowGame.addEventListener("click", changePosition);
shape.addEventListener("mousemove", runFromMouse);
colorShape.addEventListener(
  "change",
  () => (shape.style.backgroundColor = colorShape.value)
);

function runFromMouse(e) {
  if (checkbox.checked) {
    console.log("runFromMouse");
    let x = e.offsetX ? e.layerX : e.offsetX;
    let y = e.offsetY ? e.layerY : e.offsetY;

    let gameField = windowGame.getBoundingClientRect();
    let spanField = e.target.getBoundingClientRect();

    let centerX = spanField.left - gameField.left + 25;
    let centerY = spanField.top - gameField.top + 25;

    let pointX = spanField.left - gameField.left + x;
    let pointY = spanField.top - gameField.top + y;

    if (pointX > centerX) {
      centerX -= pointX + 25 - centerX;
    } else {
      centerX += centerX + 25 - pointX;
    }

    if (pointY > centerY) {
      centerY -= pointY + 25 - centerY;
    } else {
      centerY += centerY + 25 - pointY;
    }

    //  Проверка выходит ли круг за границы игрового поля
    //  Очередность проверки  - левый край, верх, правый край, низ
    if (centerX < 30) {
      centerX = 30;
    }
    if (centerY < 30) {
      centerY = 30;
    }
    if (centerX + 30 > gameField.width) {
      centerX = gameField.width - 30;
    }
    if (centerY + 30 > gameField.height) {
      centerY = gameField.height - 30;
    }

    shape.style.top = centerY - 25 + "px";
    shape.style.left = centerX - 25 + "px";
  }
}
function changePosition(e) {
  if (!checkbox.checked) {
    let x = e.offsetX ? e.layerX : e.offsetX;
    let y = e.offsetY ? e.layerY : e.offsetY;
    
    let gameField = windowGame.getBoundingClientRect();
    let spanField = e.target.getBoundingClientRect();

    if (e.target.tagName == "SPAN") {
      x = spanField.left - gameField.left + x;
      y = spanField.top - gameField.top + y;
    }

    //  Проверка выходет ли круг за границы игрового поля
    //  Очередность проверки  - левый край, верх, правый край, низ
    if (x < 30) {
      x = 30;
    }
    if (y < 30) {
      y = 30;
    }
    if (x + 30 > gameField.width) {
      x = gameField.width - 30;
    }
    if (y + 30 > gameField.height) {
      y = gameField.height - 30;
    }

    shape.style.top = y - 25 + "px";
    shape.style.left = x - 25 + "px";
  }
}

// Функции удаления класса фигуры и добавление согласно кнопке
function circle() {
  let shape = document.querySelector("#shape");
  shape.classList.remove("square");
  shape.classList.remove("moon");
  shape.classList.add("circle");
  shape.style.backgroundColor = colorShape.value;
  colorShape.disabled = false;
}

function square() {
  let shape = document.querySelector("#shape");
  shape.classList.remove("circle");
  shape.classList.remove("moon");
  shape.classList.add("square");
  shape.style.backgroundColor = colorShape.value;
  colorShape.disabled = false;
}

function moon() {
  let shape = document.querySelector("#shape");
  shape.classList.remove("circle");
  shape.classList.remove("square");
  shape.classList.add("moon");
  shape.style.backgroundColor = "#00ffff";
  colorShape.disabled = true;
}
