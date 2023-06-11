/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
export default class DOM {
  initialize() {
    const sidenav = document.querySelector(".sidenav");
    const menuButton = document.querySelector(".expand");

    menuButton.addEventListener("click", () => {
      sidenav.classList.toggle("active");
    });

    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
      page.style.display = "none";
    });
    document.querySelector(".inbox-page").style.display = "block";

    sidenav.addEventListener("click", (event) => { // add a single event listener to the parent element that contains all the buttons
      const button = event.target.closest("a"); // get the closest anchor element that was clicked
      if (button) {
        const { targetId } = button.dataset; // get the data attribute that indicates which page to show
        if (targetId) {
          pages.forEach(page => { // loop through all the pages
            if (page.id === targetId) { // if the page ID matches the target page ID, show the page; otherwise, hide the page
              page.style.display = "block";
            } else {
              page.style.display = "none";
            }
          });
        }
      }
    });


    // const inboxLink = document.getElementById('inbox-page');
    // const todayLink = document.getElementById('today-page');
    // const upcomingLink = document.getElementById('upcoming-page');



    // inboxLink.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   const state = { page: 'inbox' };
    //   const title = 'Inbox';
    //   const url = '/inbox';
    //   window.history.pushState(state, title, url);
    // });

    // todayLink.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   const state = { page: 'today' };
    //   const title = 'Today';
    //   const url = '/today';
    //   window.history.pushState(state, title, url);
    // });

    // upcomingLink.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   const state = { page: 'upcoming' };
    //   const title = 'Upcoming';
    //   const url = '/upcoming';
    //   window.history.pushState(state, title, url);
    // });
  }
}

