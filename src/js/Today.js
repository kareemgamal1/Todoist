/* eslint-disable import/no-cycle */
// eslint-disable-next-line import/no-cycle
import Task from "./Task";
import TodayDOM from "./DOM/TodayDOM";
import LocalStorage from "./localStorage";

export default class Today {
    constructor() {
        this.todayDOM = new TodayDOM();
        this.localStorage = new LocalStorage();
        this.tasks = this.localStorage.getTodayTasks();
    }

    initialize() {
        this.todayDOM.initialize(this);
    }

    addTask() {
        const htmlItem = document.querySelector(".today-page");
        const taskName = htmlItem.querySelector(".taskName");
        const taskDescription = htmlItem.querySelector(".taskDescription");
        let taskDate = htmlItem.querySelector(".taskDate");

        if (taskName.value.length === 0) {
            return;
        }

        if (taskDate.value) {
            taskDate = new Date(taskDate.value);
        }
        else {
            taskDate = new Date();
            taskDate.setHours(0, 0, 0, 0);
        }

        const taskToAdd = new Task(taskName.value, taskDescription.value, taskDate, 1);

        taskToAdd.initialize();
        taskToAdd.addTask();

        this.tasks = this.localStorage.getTodayTasks();
        this.localStorage.setTodayTasks(this.tasks);
        this.noOfTasks = this.tasks.length;

        this.updateTasks();
    }

    addTaskFromOutside(task) {
        this.tasks.push(task);
        this.noOfTasks = this.tasks.length;
        this.localStorage.setTodayTasks(this.tasks);
        this.todayDOM.addTask(task);
        this.updateTasks();
    }

    addEventListeners() {
        const htmlItem = document.querySelector(".today-page");
        const addTaskBtn = htmlItem.querySelector(".submit-task");

        addTaskBtn.addEventListener("click", () => {
            this.addTask();
        }
        );
        this.todayDOM.addEventListeners(this);
    }

    updateTasks() {
        const today = new Date();
        this.tasks = this.localStorage.getTodayTasks();
        this.tasks = this.tasks.filter((task) =>
            new Date(task.date).toDateString() === today.toDateString()
        );

        this.localStorage.setTodayTasks(this.tasks);
        this.todayDOM.updateTasks(this);
        this.tasks.forEach(task =>
            task.addEventListenersAt("today")
        );
    }
}
