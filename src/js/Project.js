import ProjectDOM from "./ProjectDOM";
import Task from "./Task";
import TaskDOM from "./TaskDOM";

export default class Project {
  constructor(key, name, ...tasks) {
    this.nextTaskID = 0;
    this.ID = key;
    this.name = name;
    if (tasks) {
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
    console.log(this.ID)
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
    const taskToAdd = new Task(this.nextTaskID, taskName.value, taskDescription.value, this.ID)
    this.projectDOM.addTask(this, taskName, taskDescription)

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");

    const projectIndex = projects.findIndex((p) => p.ID == this.ID)

    const tasksDB = projects[projectIndex]['tasks']
    let x = tasksDB.map((task) => {
      task.taskDOM = new TaskDOM()
      return Object.assign(new Task(), task)
    }
    )

    this.tasks = x //I have raw data, i should convert it to objects
    this.tasks.push(taskToAdd)
    this['noOfTasks'] = this['tasks'].length;
    console.log(this.tasks)
    projects[projectIndex] = this
    localStorage.setItem('projects', JSON.stringify(projects))


    taskToAdd.addEventListeners()
  }

  addTasks() {
    this.projectDOM.addTasks(this);
  }

  finishTask(taskID) {
    console.log(taskID)
    const taskIndex = this.tasks.findIndex((task) => task.ID == taskID)
    console.log(this['tasks'].at(taskIndex))
    this['tasks'].at(taskIndex).finishTask(this.ID)
    this['tasks'] = this['tasks'].filter((task) => task.ID != parseInt(taskID))
    this.projectDOM.finishTask(taskID);
    //TODO FIX ERROR: 
    /*Use Case: delete two default tasks, add new one, delete it, add new one, delete it
    Error: newly added tasks doesn't affect the Project object
    */
    //TODO Finish task adds up to the counter at the top, removes task from all across the app.

  }
}