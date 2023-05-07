import TaskDOM from "./TaskDOM";
import LocalStorage from "./localStorage";

export default class Task {
  constructor(name, description, date, projectID, locationID) {
    this.ID = this.generateRandomId()
    this.name = name;
    this.description = description

    if (date)
      this.date = date
    else
      this.date = ""

    //TODO a task should be able to decide where should i be? inbox in a project? today in a list? or upcoming into a project
    this.projectID = projectID
    this.locationID = locationID

    if (locationID === 0)
      this.location = "project-" + projectID
    else if (locationID === 1)
      this.location = "today"

    this.localStorage = new LocalStorage();
    this.taskDOM = new TaskDOM(this)//necessary for the conversion from JSON to Object
  }

  generateRandomId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  addEventListeners() {
    const htmlItem = document.querySelector(`.${this.location}-task-${this.ID}`)
    let finishBtn = htmlItem.querySelector('.done')
    finishBtn.addEventListener('click', () => {
      this.finishTask(this.projectID, this.ID)
    })
    this.taskDOM.addEventListeners(this)
  }

  finishTask() {
    //the first part is concerned with the storage of the task itself in the project, at last, you deal with the task's removal itself, handling the DOM aspect such as increasing total number of tasks completed at top.

    //Projects
    let projectID = -1
    let projects = this.localStorage.getProjects()
    for (const project of projects) {
      for (const task of project.tasks) {
        if (task.ID === this.ID) {
          projectID = project.ID;
          break;
        }
      }
    }

    const projectIndex = projects.findIndex((p) => p.ID == projectID)
    let project = projects[projectIndex]
    project['tasks'] = project['tasks'].filter((task) =>
      task.ID != this.ID
    )
    project['noOfTasks'] = project['tasks'].length;
    projects[projectIndex] = project
    this.localStorage.finishTask(projects)
    //Today
    let todayTasks = this.localStorage.getToday()
    const taskIndex = todayTasks.findIndex((t) => t.ID == this.ID)
    todayTasks = todayTasks.filter((task) =>
      task.ID != this.ID
    )
    if (taskIndex !== -1) {
      this.localStorage.setToday(todayTasks)
    }

    this.taskDOM.finishTask(project, this.ID)
  }



}