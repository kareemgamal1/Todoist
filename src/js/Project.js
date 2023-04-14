import ProjectDOM from "./ProjectDOM";
import Task from "./Task";
import TaskDOM from "./TaskDOM";

export default class Project {
  constructor(key, name, ...tasks) {
    this.nextTaskID = 0;
    this.ID = key;
    this.name = name;
    if (tasks) {
      //Since i initialize some data from Inbox, i wanted to add the freedom of either adding tasks (initial app data) or initializing it as an empty project (as in the case of creating a new project)
      this.tasks = tasks
      this.noOfTasks = tasks.length
    }
    else {
      this.tasks = [{}]
      this.noOfTasks = 0
    }
    this.projectDOM = new ProjectDOM() //singleton (yay design patterns)

  }

  addEventListeners() {
    const htmlItem = document.querySelector(".project-" + this.ID)
    let finishtask = htmlItem.querySelectorAll('.done')
    let addTaskBtn = htmlItem.querySelector('.submit-task')

    finishtask.forEach(btn => {
      btn.addEventListener('click', () => {
        const taskHTML = btn.parentElement
        let elementClass = taskHTML.classList[1].match(/\d+/g)
        let taskID = elementClass[1]
        this.finishTask(taskID)
      })
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

    console.log(taskDate.value)


    const taskToAdd = new Task(this.nextTaskID, taskName.value, taskDescription.value, taskDate.valueAsDate, this.ID)

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");

    const projectIndex = projects.findIndex((p) => p.ID == this.ID)

    const tasksDB = projects[projectIndex]['tasks']
    let x = tasksDB.map((task) => {
      task.taskDOM = new TaskDOM()
      return Object.assign(new Task(), task)
    }
    )

    this.tasks = x
    this.tasks.push(taskToAdd)
    this['noOfTasks'] = this['tasks'].length;
    projects[projectIndex] = this
    localStorage.setItem('projects', JSON.stringify(projects))


    this.projectDOM.addTask(this, taskName, taskDescription, taskDate)
    taskToAdd.addEventListeners()

  }

  addTasks() {
    this.projectDOM.addTasks(this);
  }

  finishTask(taskID) {
    //the first part is concerned with the storage of the task itself in the project, at last, you deal with the task's removal itself, handling the DOM aspect such as increasing total number of tasks completed at top.
    const taskIndex = this.tasks.findIndex((task) => task.ID == taskID)
    this['tasks'].at(taskIndex).finishTask(this.ID)
    this['tasks'] = this['tasks'].filter((task) => task.ID != parseInt(taskID))
  }
}