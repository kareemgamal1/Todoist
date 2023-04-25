import ProjectDOM from "./ProjectDOM";
import Task from "./Task";
import TaskDOM from "./TaskDOM";
import LocalStorage from "./localStorage";

export default class Project {
  constructor(key, name, ...tasks) {
    this.nextTaskID = 0;
    this.ID = key;
    this.name = name;
    //Since i initialize some data from Inbox, i wanted to add the freedom of either adding tasks (initial app data) or initializing it as an empty project (as in the case of creating a new project)
    if (tasks) {
      this.tasks = tasks
      this.noOfTasks = tasks.length
      this.nextTaskID = tasks.length;

    }
    else {
      this.tasks = []
      this.noOfTasks = 0
    }

    this.localStorage = new LocalStorage();
    this.projectDOM = new ProjectDOM(this)
  }

  addProject() {
    this.projectDOM.addProject(this)
    this.localStorage.addProject(this)
  }

  addProjectToDOM() {
    this.projectDOM.addProject(this)
  }

  deleteProject() {
    let projects = this.localStorage.getProjects()
    projects = projects.filter((project) => {
      return project.ID != this.ID
    }
    )
    this.localStorage.setProjects(projects)
    this.projectDOM.deleteProject(this)
  }

  addEventListeners() {
    console.log("S")
    const htmlItem = document.querySelector(".project-" + this.ID)
    let deleteProject = htmlItem.querySelector('.deleteProject')
    let addTaskBtn = htmlItem.querySelector('.submit-task')

    deleteProject.addEventListener('click', () => {
      this.deleteProject()
    })

    addTaskBtn.addEventListener('click', () => {
      this.addTask();
    }
    )


    this.projectDOM.addEventListeners(this)
  }

  addTask() {
    const htmlItem = document.querySelector(".project-" + this.ID)
    let taskName = htmlItem.querySelector('.taskName')
    let taskDescription = htmlItem.querySelector('.taskDescription')
    let taskDate = htmlItem.querySelector('.taskDate')

    if (taskName.value.length === 0) {
      return;
    }

    if (taskDate.value) {
      taskDate = new Date(taskDate.value)
    }
    else {
      taskDate = new Date()
      taskDate.setHours(0, 0, 0, 0);
    }

    const taskToAdd = new Task(this.nextTaskID++, taskName.value, taskDescription.value, taskDate, this.ID)

    let projects = this.localStorage.getProjects()
    const projectIndex = projects.findIndex((p) => p.ID == this.ID)

    const tasksDB = projects[projectIndex]['tasks']

    let newTasks = tasksDB.map((task) => {
      task.taskDOM = new TaskDOM()
      return Object.assign(new Task(), task)
    }
    )

    this.tasks = newTasks
    this.tasks.push(taskToAdd)
    this['noOfTasks'] = this['tasks'].length;
    projects[projectIndex] = this
    this.localStorage.setProjects(projects)

    this.projectDOM.addTask(this, taskToAdd)
    this.updateTasks()
  }

  updateTasks() {
    this.projectDOM.updateTasks(this);
    this.tasks.forEach((task) => {
      task.addEventListeners()
    })
  }

}