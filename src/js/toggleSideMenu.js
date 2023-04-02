let menu = document.querySelector(".sidenav");
let inbox = document.querySelector(".inbox-page");
let menuButton = document.querySelector(".expand");
menu.style.visibility = "hidden"


function toggleMenu() {
  console.log(menu.style.visibility)
  menu.style.visibility = "visible"
  inbox.style.marginLeft = "20%";
}

function closeMenu() {
  if (document.querySelectorAll(".inbox-page .inbox-content").length > 0) {
    inbox.style.marginLeft = "auto";
  } else {
    inbox.style.marginLeft = "20%";
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
