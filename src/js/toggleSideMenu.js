let menu = document.querySelector(".sidenav");
let main = document.querySelector(".main");
let menuButton = document.querySelector(".expand");

function toggleMenu() {
  menu.classList.remove("d-none");
  main.style.paddingLeft = "20%";
  main.style.paddingRight = "10%";
}

function closeMenu() {
  if (document.querySelectorAll(".main .inbox-page").length > 0) {
    main.style.paddingLeft = "2%";
    main.style.paddingRight = "2%";
  } else {
    main.style.paddingLeft = "15%";
    main.style.paddingRight = "15%";
  }
  menu.classList.add("d-none");
}

menuButton.addEventListener("click", () => {
  if (menu.classList.contains("d-none")) {
    toggleMenu();
  } else {
    closeMenu();
  }
});
