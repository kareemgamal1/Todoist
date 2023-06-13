/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
export default class DOM {
  initialize() {
    this.listenToSideNav();
    this.listenToSearchBar();
  }

  listenToSideNav() {
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
    // this.activateRoutingPages(); //TODO
  }

  activateRoutingPages() {
    // TODO Routing stuff, figured out it wasn't really necessary to deal with for now.
    // THIS FUNCTION IS NOT CALLED
    const inboxLink = document.getElementById("inbox-page");
    const todayLink = document.getElementById("today-page");
    const upcomingLink = document.getElementById("upcoming-page");



    inboxLink.addEventListener("click", (event) => {
      event.preventDefault();
      const state = { page: "inbox" };
      const title = "Inbox";
      const url = "/inbox";
      window.history.pushState(state, title, url);
    });

    todayLink.addEventListener("click", (event) => {
      event.preventDefault();
      const state = { page: "today" };
      const title = "Today";
      const url = "/today";
      window.history.pushState(state, title, url);
    });

    upcomingLink.addEventListener("click", (event) => {
      event.preventDefault();
      const state = { page: "upcoming" };
      const title = "Upcoming";
      const url = "/upcoming";
      window.history.pushState(state, title, url);
    });
  }

  listenToSearchBar() {
    const searchBar = document.querySelector(".searchBar");

    searchBar.addEventListener("input", () => {
      const tasks = document.querySelectorAll(".task"); // Moved inside because new tasks weren't updated

      const query = searchBar.value.toLowerCase();

      const tasksList = document.querySelectorAll(".tasks-list");
      tasksList.forEach(tasksList => {
        const tasksInList = tasksList.querySelectorAll(".task");
        if (tasksInList.length === 0) {
          tasksList.style.display = "none";
          tasksList.parentElement.style.display = "none";
        }
        if (query.length === 0) {
          tasksList.style.display = "block";
          tasksList.parentElement.style.display = "block";
        }
      });

      tasks.forEach((task) => {
        const tasksList = task.parentElement;
        const taskContainer = tasksList.parentElement;
        const name = task.querySelector(".task-name").textContent.toLowerCase();
        if (name.includes(query)) {
          task.style.display = "flex";
          tasksList.style.display = "block";
          taskContainer.style.display = "block";
        } else {
          task.style.display = "none";

          const visibleTasks = Array.from(tasksList.children).filter((task) => task.style.display !== "none");

          if (visibleTasks.length === 0) {
            tasksList.style.display = "none";
            taskContainer.style.display = "none";
          } else {
            tasksList.style.display = "block";
            taskContainer.style.display = "block";
          }
        }
      });
    });
  }

}

