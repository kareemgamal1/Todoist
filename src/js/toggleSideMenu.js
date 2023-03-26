let menu = document.querySelector(".sidenav");
let main = document.querySelector(".main");
let menuButton = document.querySelector(".expand");
menu.style.visibility = "hidden"


function toggleMenu() {
  console.log(menu.style.visibility)
  menu.style.visibility = "visible"
  main.style.marginLeft = "20%";
}

function closeMenu() {
  if (document.querySelectorAll(".main .inbox-page").length > 0) {
    main.style.marginLeft = "auto";

  } else {
    main.style.marginLeft = "15%";
  }
  menu.style.visibility = "hidden"

}

menuButton.addEventListener("click", () => {
  if (menu.style.visibility == "hidden") {
    toggleMenu();
  } else {
    closeMenu();
  }
});
