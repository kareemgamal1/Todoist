/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
import ProjectDOM from "./DOM/ProjectDOM";
import Task from "./Task";
import TaskDOM from "./DOM/TaskDOM";
import LocalStorage from "./localStorage";

export default class Project {
  constructor(name, ...tasks) {
    this.ID = this.generateRandomId();
    this.name = name;

    // Initialize the project's tasks array with the provided tasks, or as an empty array
    if (tasks) {
      this.tasks = tasks;
      this.noOfTasks = tasks.length;
    } else {
      this.tasks = [];
      this.noOfTasks = 0;
    }

    this.projectDOM = new ProjectDOM();
    this.localStorage = new LocalStorage();
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

  // Add the project to the local storage and the DOM
  addProject() {
    this.projectDOM.addProject(this);
    this.localStorage.addProject(this);
  }

  // Add the project to the DOM only, necesarry for initializeProjects() in Inbox, as it already adds them to localStorage
  addProjectToDOM() {
    this.projectDOM.addProject(this);
  }

  // Add event listeners to the project's DOM elements
  addEventListeners() {
    const htmlItem = document.querySelector(`.project-${this.ID}`);
    const deleteProject = htmlItem.querySelector(".deleteProject");
    const addTaskBtn = htmlItem.querySelector(".submit-task");

    deleteProject.addEventListener("click", () => {
      this.deleteProject();
    });

    addTaskBtn.addEventListener("click", () => {
      this.addTask();
    });

    this.projectDOM.addEventListeners(this);
  }

  // Delete the project from the local storage and the DOM
  deleteProject() {
    let projects = this.localStorage.getProjects();
    projects = projects.filter((project) => project.ID !== this.ID);

    this.localStorage.setProjects(projects);
    this.projectDOM.deleteProject(this);
  }


  // Add a new task to the project
  addTask() {
    const htmlItem = document.querySelector(`.project-${this.ID}`);
    let [taskName, taskDescription, taskDate] = htmlItem.querySelectorAll(".taskName, .taskDescription, .taskDate");

    // Validate the task name
    if (taskName.value.length === 0) {
      return;
    }

    // Parse the task date
    if (taskDate.value) {
      taskDate = new Date(taskDate.value);
    } else {
      taskDate = new Date();
      taskDate.setHours(0, 0, 0, 0);
    }

    // Create a new task object and add it to the project's tasks array
    const taskToAdd = new Task(taskName.value, taskDescription.value, taskDate);
    taskToAdd.projectID = this.ID;
    taskToAdd.initialize();
    taskToAdd.addTask();
    taskToAdd.addEventListeners();

    this.addTaskToLocalStorage(taskToAdd);
    this.updateTasks();
  }

  addTaskToLocalStorage(task) {
    const projects = this.localStorage.getProjects(); // Get the list of projects from local storage
    const projectIndex = projects.findIndex((p) => p.ID = this.ID); // Find the index of this project in the list
    const tasksDB = projects[projectIndex].tasks; // Get the tasks for this project from local storage
    const newTasks = tasksDB.map((task) => { // Create a new array of tasks with updated task DOM objects
      task.taskDOM = new TaskDOM(); // Instantiate TaskDOM for each task
      return Object.assign(new Task(), task); // Combine the Task object with the task from local storage
    });
    this.tasks = newTasks; // Update the tasks for this project
    this.tasks.push(task); // Add the new task to the tasks array
    this.noOfTasks = this.tasks.length; // Update the number of tasks for this project
    projects[projectIndex] = this; // Update the project in the projects list with the new task
    this.localStorage.setProjects(projects); // Update the projects in local storage
    this.tasks = this.localStorage.getProjectTasks(this.ID); // Get the updated tasks for this project from local storage
  }

  // Update the project's tasks in the DOM and add event listeners to the tasks
  updateTasks() {
    this.projectDOM.updateTasks(this);
  }
}