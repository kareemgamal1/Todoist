const sidenav = document.querySelector('.sidenav');
const content = document.querySelector('.content-wrap');


let menu = document.querySelector(".sidenav");
let inbox = document.querySelector(".inbox-page");
let menuButton = document.querySelector(".expand");

export class DOM {
  constructor() {
    menuButton.addEventListener('click', () => {
      console.log('s')
      sidenav.classList.toggle('active');
    });

  }

  toggleMenu() {
    menu.style.visibility = "visible"
    inbox.style.marginLeft = "20%";
  }

  closeMenu() {
    if (document.querySelectorAll(".inbox-page .inbox-content").length > 0) {
      inbox.style.marginLeft = "auto";
    } else {
      inbox.style.marginLeft = "20%";
    }
    menu.style.visibility = "hidden"
  }


}
new DOM()

