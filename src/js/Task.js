import TaskDOM from "./DOM/TaskDOM";
import Today from "./Today";
import LocalStorage from "./localStorage";

export default class Task {
  constructor(name, description, date) {
    this.ID = this.generateRandomId()
    this.name = name;
    this.description = description
    this.date = new Date(date)
    this.localStorage = new LocalStorage();

    this.taskDOM = new TaskDOM(this)//necessary for the conversion from JSON to Object

    //TODO a task should have the same consistent structure across all places where it exists, thus i should have a location array that puts the task in each DOM location and updates it in each localStorage container
    this.locations = []
    this.projectID = -1
    this.dayID = `${this.date.getFullYear()}${this.date.getMonth() + 1}${this.date.getDate()}`
  }

  generateRandomId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  addTask() {
    this.locations.forEach(location => {
      if (location.includes('project')) {
        const htmlItem = document.querySelector(`.${location}`)
        let taskDOM = new TaskDOM();
        let newTask = taskDOM.addTask(this, location)
        let tasks = htmlItem.querySelector('.tasks-list')
        tasks.innerHTML += newTask

        let noOfTasksSpan = document.querySelector(`.${location} .noOfTasks`)
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) + 1
      }
      else if (location.includes('today')) {
        let today = new Today()
        today.addTaskFromOutside(this)
      }
      else if (location.includes('day')) {
        const htmlItem = document.querySelector(`.${location}`)
        let taskDOM = new TaskDOM();
        let newTask = taskDOM.addTask(this, location)
        let tasks = htmlItem.querySelector('.tasks-list')
        tasks.innerHTML += newTask
      }
    })
    // this.addEventListeners()
  }

  addEventListeners() {
    console.log('x')
    this.locations.forEach(location => {
      if (!location.includes('day')) {
        const htmlItem = document.querySelector(`.${location}-task-${this.ID}`)
        let finishBtn = htmlItem.querySelector('.done')
        finishBtn.addEventListener('click', () => {
          this.finishTask()
        })
        this.taskDOM.addEventListeners(this)
      }
    })
  }

  addEventListenersAt(location) {
    const htmlItem = document.querySelector(`.${location}-task-${this.ID}`)
    let finishBtn = htmlItem.querySelector('.done')
    finishBtn.addEventListener('click', () => {
      this.finishTask()
    })
    this.taskDOM.addEventListenersAt(this, location)
  }

  finishTask() {
    //the first part is concerned with the storage of the task itself in the project, at last, you deal with the task's removal itself, handling the DOM aspect such as increasing total number of tasks completed at top.
    let projectID = this.getProjectID(this)
    let projects = this.localStorage.getProjects()
    const projectIndex = projects.findIndex((p) => p.ID == projectID)
    let project = projects[projectIndex]

    this.localStorage.finishTask(this)

    this.taskDOM.finishTask(this.ID, project)
  }

  getProjectID() {
    return this.localStorage.getProjectID(this)
  }

  getDayID() {
    let dayID = -1
    let tasks = this.localStorage.getTasks()
    for (const task of tasks) {
      if (task.ID === this.ID) {
        dayID = task.dayID;
        break;
      }
    }
    return dayID
  }

  getIsToday() {
    const today = new Date()
    const isToday = this.date.getDate() === today.getDate() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear()

    return isToday
  }

  initialize() {
    this.projectID = this.getProjectID()
    this.isToday = this.getIsToday()

    if (this.projectID !== -1)
      this.locations.push("project-" + this.projectID)

    if (this.isToday)
      this.locations.push("today")

    if (this.dayID !== -1)
      this.locations.push("day-" + this.dayID)
  }

}