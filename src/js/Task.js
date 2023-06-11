/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-cycle */
import TaskDOM from "./DOM/TaskDOM";
import Day from "./Day";
import Today from "./Today";
import LocalStorage from "./localStorage";

export default class Task {
  constructor(name, description, date) {
    this.ID = this.generateRandomId();
    this.name = name;
    this.description = description;
    this.date = new Date(date);
    this.localStorage = new LocalStorage();

    this.taskDOM = new TaskDOM(); // necessary for the conversion from JSON to Object

    this.locations = [];
    this.projectID = -1;
    this.dayID = `${this.date.getFullYear()}${this.date.getMonth() + 1}${this.date.getDate()}`;
  }

  generateRandomId() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Define the characters to use for the ID

    // Loop 10 times to generate a 10-character ID
    for (let i = 0; i < 10; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * characters.length)); // Add a random character from the characters string to the result string
    }

    return result; // Return the generated ID
  }

  addTask() {
    // Loop through each location in the locations array
    this.locations.forEach(location => {

      if (location.includes("project")) { // If the location is a project page
        const htmlItem = document.querySelector(`.${location}`); // Get the HTML element for the project page
        const taskDOM = new TaskDOM(); // Instantiate TaskDOM
        const newTask = taskDOM.addTask(this, location); // Add a new task to the project page
        const tasks = htmlItem.querySelector(".tasks-list"); // Get the tasks list element
        tasks.innerHTML += newTask; // Add the new task HTML to the tasks list

        const noOfTasksSpan = document.querySelector(`.${location} .noOfTasks`); // Get the number of tasks element for the project page
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent, 10) + 1; // Increment the number of tasks for the project page
        this.addEventListenersAt(location); // Add event listeners for the new task on the project page
      }
      else if (location.includes("today")) { // If the location is the today page
        const today = new Today(); // Instantiate Today
        today.addTaskFromOutside(this); // Add the new task to the today page
        this.addEventListenersAt(location); // Add event listeners for the new task on the today page
      }
      else if (location.includes("day")) { // If the location is a day page
        // Two possibilities, the day is in the DOM already or yet to be there
        const day = new Day(this.date); // Instantiate Day
        day.addTaskFromOutside(this); // Add the new task to the day page
        this.addEventListenersAt(location); // Add event listeners for the new task on the day page
      }
    });

    this.localStorage.addTask(this); // Add the new task to local storage
  }

  addEventListeners() {
    this.locations.forEach(location => {
      if (!location.includes("day")) {
        const htmlItem = document.querySelector(`.${location}-task-${this.ID}`);
        const finishBtn = htmlItem.querySelector(".done");
        finishBtn.addEventListener("click", () => {
          this.finishTask();
        });
        this.taskDOM.addEventListeners(this);
      }
    });
  }

  addEventListenersAt(location) {
    const htmlItem = document.querySelector(`.${location}-task-${this.ID}`);
    if (!htmlItem) return;
    const finishBtn = htmlItem.querySelector(".done");
    finishBtn.addEventListener("click", () => {
      this.finishTask();
    });
    this.taskDOM.addEventListenersAt(this, location);
  }

  finishTask() {
    // the first part is concerned with the storage of the task itself in the project, at last, you deal with the task's removal itself, handling the DOM aspect such as increasing total number of tasks completed at top.
    const projectID = this.getProjectID(this);

    let project = this.getProject(projectID);
    this.localStorage.finishTask(this);
    project = this.getProject(projectID);

    this.taskDOM.finishTask(this.ID, project);
  }

  getProjectID() {
    return this.localStorage.getProjectID(this);
  }

  getProject(projectID) {
    const projects = this.localStorage.getProjects();
    const projectIndex = projects.findIndex((p) => p.ID === projectID);
    const project = projects[projectIndex];
    return project;
  }

  getIsToday() {
    const today = new Date();
    const isToday = this.date.getDate() === today.getDate() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear();

    return isToday;
  }

  initialize() {
    this.isToday = this.getIsToday();

    if (this.projectID !== -1)
      this.locations.push(`project-${this.projectID}`);

    if (this.isToday)
      this.locations.push("today");

    const today = new Date();

    const taskYear = this.date.getFullYear();
    const taskMonth = this.date.getMonth();
    const taskDay = this.date.getDate();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const dateIsBigger = taskYear > currentYear ||
      (taskYear === currentYear && taskMonth > currentMonth) ||
      (taskYear === currentYear && taskMonth === currentMonth && taskDay >= currentDay);
    if (this.dayID !== -1 && dateIsBigger) {
      this.locations.push(`day-${this.dayID}`);
    }
  }
}