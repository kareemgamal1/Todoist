import ProjectDOM from "./DOM/ProjectDOM";
import Task from "./Task";
import TaskDOM from "./DOM/TaskDOM";
import LocalStorage from "./localStorage";

export default class Project {
  constructor(name, ...tasks) {
    // Initialize project properties
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

    // Create instances of LocalStorage and ProjectDOM classes
    this.projectDOM = new ProjectDOM();
    this.localStorage = new LocalStorage();
  }

  generateRandomId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
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

  // Delete the project from the local storage and the DOM
  deleteProject() {
    let projects = this.localStorage.getProjects();
    projects = projects.filter((project) => {
      return project.ID != this.ID;
    });

    this.localStorage.setProjects(projects);
    this.projectDOM.deleteProject(this);
  }

  // Add event listeners to the project's DOM elements
  addEventListeners() {
    const htmlItem = document.querySelector(".project-" + this.ID);
    let deleteProject = htmlItem.querySelector('.deleteProject');
    let addTaskBtn = htmlItem.querySelector('.submit-task');

    // Add event listener for deleting the project
    deleteProject.addEventListener('click', () => {
      this.deleteProject();
    });

    // Add event listener for adding a task to the project
    addTaskBtn.addEventListener('click', () => {
      this.addTask();
    });

    // Add event listeners to the project's tasks
    this.projectDOM.addEventListeners(this);
  }

  // Add a new task to the project
  addTask() {
    const htmlItem = document.querySelector(".project-" + this.ID);
    let [taskName, taskDescription, taskDate] = htmlItem.querySelectorAll('.taskName, .taskDescription, .taskDate');

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

    this.tasks = this.localStorage.getProjectTasks(this.ID)
    taskToAdd.projectID = this.ID
    taskToAdd.initialize()
    taskToAdd.addTask()
    taskToAdd.addEventListeners()
    this.tasks = this.localStorage.getProjectTasks(this.ID)
    console.log('ssss')
    // Add the new task to the project's DOM and update the tasks
    //TODO New task doesn't have the location of the project
    this.updateTasks();
    this.addTaskToLocalStorage(taskToAdd)
  }

  addTaskToLocalStorage(task) {
    let projects = this.localStorage.getProjects();
    const projectIndex = projects.findIndex((p) => p.ID == this.ID);
    const tasksDB = projects[projectIndex]['tasks'];
    let newTasks = tasksDB.map((task) => {
      task.taskDOM = new TaskDOM();
      return Object.assign(new Task(), task);
    });
    this.tasks = newTasks;
    this.tasks.push(task);
    this['noOfTasks'] = this['tasks'].length;
    projects[projectIndex] = this;
    this.localStorage.setProjects(projects);
  }
  // Update the project's tasks in the DOM and add event listeners to the tasks
  updateTasks() {
    this.projectDOM.updateTasks(this);
  }
}