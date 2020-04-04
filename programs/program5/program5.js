"use strict";
const ONE_SECOND = 1000;
let delay = ONE_SECOND;

let btnOpen = document.querySelector("#button-open");
let btnStop = document.querySelector("#button-stop");
let btnClose = document.querySelector("#button-close");
let menu = document.querySelector(".menu-list");
let timerId;

// program buttons for work with menu ( list )

btnOpen.addEventListener("click", () => {
  menu.classList.toggle("open");

  let isOpen = menu.classList.contains("open");

  if (isOpen) {
    btnOpen.innerHTML = "Hide";
    let submenu = menu.querySelector(".submenu");
    timerId = setTimeout(openMenu, delay, submenu);
  } else {
    btnOpen.innerHTML = "Open";
    let openMenu = menu.querySelectorAll(".open");
    closeOpenItems(openMenu);
  }
});

btnStop.addEventListener("click", () => {
  clearTimeout(timerId);
});

btnClose.addEventListener("click", () => {
  let isOpen = menu.classList.contains("open");

  if (isOpen) {
    let openElements = menu.querySelectorAll(".open");
    timerId = setTimeout(closeMenu, delay, openElements);
    if (btnOpen.innerHTML === "Hide") {
      btnOpen.innerHTML = "Open";
    }
  }
});

menu.addEventListener("click", event => {
  let { target } = event;
  let submenu = target.querySelector(".submenu");
  let closeAll = menu.querySelectorAll(".submenu.open");
  let className = submenu.parentElement.classList.value;

  // Check first item of menu, click on this item must close all submenu
  if (className === "menu") {
    for (let i = 0; i < closeAll.length; i++) {
      if (submenu === closeAll[i]) {
        continue;
      }
      closeAll[i].classList.remove("open");
    }
  }

  // If you click on submenu than open or close it ( use toggle )
  if (submenu) {
    submenu.classList.toggle("open");
  }
});

function openMenu(element) {
  if (!element) {
    return;
  }
  element.classList.add("open");
  let nextElement = element.children[0].querySelector(".submenu");
  timerId = setTimeout(openMenu, delay, nextElement);
}

function closeMenu(element) {
  let last = element.length - 1;
  let noOpenSubmenu = -1;

  if (last === noOpenSubmenu) {
    menu.classList.remove("open");
    return;
  }

  element[last].classList.remove("open");

  let openElements = menu.querySelectorAll(".open");
  timerId = setTimeout(closeMenu, delay, openElements);
}

function closeOpenItems(closeAll) {
  for (let i = 0; i < closeAll.length; i++) {
    closeAll[i].classList.remove("open");
  }
}
