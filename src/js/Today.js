import Task from "./Task";
import TodayDOM from "./TodayDOM";
import LocalStorage from "./localStorage";

export default class Today {
    constructor() {
        this.todayDOM = new TodayDOM()
        this.localStorage = new LocalStorage()
        this.projects = this.localStorage.getProjects()
        this.tasks = []
    }

    initialize() {
        this.projects.forEach(project => {
            project.tasks.forEach(task => {
                task.location = 'today'
                this.tasks.push(task)
            })
        })
        let today = new Date()

        this.tasks = this.tasks.filter((task) =>
            new Date(task.date).toDateString() === today.toDateString()
        )

        this.localStorage.setToday(this.tasks)
        this.todayDOM.initialize(this)
    }

    addTask() {
        const htmlItem = document.querySelector(".today")
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

        const taskToAdd = new Task(taskName.value, taskDescription.value, taskDate, this.ID, 1)

        this.tasks.push(taskToAdd)

        this.noOfTasks = this.tasks.length;

        this.todayDOM.addTask(this, taskToAdd)
        this.updateTasks()
    }

    addEventListeners() {
        const htmlItem = document.querySelector(".today")
        let addTaskBtn = htmlItem.querySelector('.submit-task')

        addTaskBtn.addEventListener('click', () => {
            this.addTask();
        }
        )
        this.todayDOM.addEventListeners(this)
    }

    updateTasks() {
        this.todayDOM.updateTasks(this);
        this.tasks.forEach((task) => {
            task.addEventListeners()
        })
    }

    updateTaskName(taskID, name) {
        let todayTasks = this.localStorage.getToday()
        let taskIndex = -1
        taskIndex = todayTasks.findIndex((t) => t.ID == taskID)
        todayTasks[taskIndex].name = name
    }
}
new Today().initialize()
