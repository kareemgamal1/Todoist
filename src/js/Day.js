import DayDOM from "./DOM/DayDOM"
import Task from "./Task"
import LocalStorage from "./localStorage"

export default class Day {
    constructor(date) {
        this.localStorage = new LocalStorage()
        this.date = date
        this.tasks = this.localStorage.getTasksForDay(date)
        this.dateString = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
        this.dayDOM = new DayDOM(this.tasks, this.date, this.dateString)
    }

    initialize() {
        this.dayDOM.initialize()
        this.tasks.forEach(task => {
            task.addEventListenersAt('day-' + this.dateString)
            task.dayID = this.dateString
        });
    }

    addEventListeners() {
        const htmlItem = document.querySelector(".day-" + this.dateString)
        let addTaskBtn = htmlItem.querySelector('.submit-task');

        // Add event listener for adding a task to the project
        addTaskBtn.addEventListener('click', () => {
            this.addTask();
        });

        // Add event listeners to the project's tasks
        this.dayDOM.addEventListeners(this);
    }

    addTask() {
        const htmlItem = document.querySelector(`.day-${this.dateString}`)
        let [taskName, taskDescription, taskDate] = htmlItem.querySelectorAll('.taskName, .taskDescription, .taskDate');

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

        const taskDateString = `${taskDate.getFullYear()}${taskDate.getMonth() + 1}${taskDate.getDate()}`
        const taskToAdd = new Task(taskName.value, taskDescription.value, taskDate)
        taskToAdd.dayID = taskDateString
        taskToAdd.initialize()
        taskToAdd.addTask()
        taskToAdd.addEventListenersAt("day-" + taskDateString)

        this.localStorage.setTasksForDay(taskDate, taskToAdd)

        if (taskDateString === this.dateString) {
            this.tasks.push(taskToAdd)
            this.updateTasks()
        }
    }

    updateTasks() {
        this.dayDOM.updateTasks(this);
        this.tasks.forEach(task => {
            task.addEventListenersAt("day-" + this.dateString)
        })
    }

    addDay() {
        this.dayDOM.addDay(this)
    }
}