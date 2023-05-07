import ProjectDOM from "./ProjectDOM";
import Task from "./Task";
import TaskDOM from "./TaskDOM";
import LocalStorage from "./localStorage";

export default class Project {
  constructor(key, name, ...tasks) {
    // Initialize project properties
    this.nextTaskID = 0;
    this.ID = key;
    this.name = name;

    // Initialize the project's tasks array with the provided tasks, or as an empty array
    if (tasks) {
      this.tasks = tasks;
      this.noOfTasks = tasks.length;
      this.nextTaskID = tasks.length;
    } else {
      this.tasks = [];
      this.noOfTasks = 0;
    }

    // Create instances of LocalStorage and ProjectDOM classes
    this.localStorage = new LocalStorage();
    this.projectDOM = new ProjectDOM(this);
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
    let taskName = htmlItem.querySelector('.taskName');
    let taskDescription = htmlItem.querySelector('.taskDescription');
    let taskDate = htmlItem.querySelector('.taskDate');

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
    const taskToAdd = new Task(taskName.value, taskDescription.value, taskDate, this.ID, 0);
    let projects = this.localStorage.getProjects();
    const projectIndex = projects.findIndex((p) => p.ID == this.ID);
    const tasksDB = projects[projectIndex]['tasks'];
    let newTasks = tasksDB.map((task) => {
      task.taskDOM = new TaskDOM();
      return Object.assign(new Task(), task);
    });
    this.tasks = newTasks;
    this.tasks.push(taskToAdd);
    this['noOfTasks'] = this['tasks'].length;
    projects[projectIndex] = this;
    this.localStorage.setProjects(projects);

    // Add the new task to the project's DOM and update the tasks
    this.projectDOM.addTask(taskToAdd);
    this.updateTasks();
  }

  // Update the project's tasks in the DOM and add event listeners to the tasks
  updateTasks() {
    this.projectDOM.updateTasks(this);
    this.tasks.forEach((task) => {
      task.addEventListeners();
    });
  }
}