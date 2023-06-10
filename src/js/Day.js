/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable prefer-const */
import DayDOM from "./DOM/DayDOM";
import Task from "./Task";
import LocalStorage from "./localStorage";

export default class Day {
    constructor(date) {
        this.localStorage = new LocalStorage();
        this.date = date;
        this.tasks = this.localStorage.getTasksForDay(date);
        this.dateString = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        this.dayDOM = new DayDOM(this.tasks, this.date, this.dateString);
    }

    initialize() {
        this.tasks = this.localStorage.getTasksForDay(this.date);
        this.dayDOM.initialize();
        this.tasks.forEach((task) => {
            task.addEventListenersAt(`day-${this.dateString}`);
            task.dayID = this.dateString;
        });
    }

    addEventListeners() {
        const htmlItem = document.querySelector(`.day-${this.dateString}`);
        const addTaskBtn = htmlItem.querySelector(".submit-task");

        addTaskBtn.addEventListener("click", () => {
            this.addTask();
        });

        this.dayDOM.addEventListeners(this);
    }

    addTask() {
        const htmlItem = document.querySelector(`.day-${this.dateString}`);
        let [taskName, taskDescription, taskDate] = htmlItem.querySelectorAll(".taskName, .taskDescription, .taskDate");

        if (taskName.value.length === 0) {
            return;
        }
        if (taskDate.value) {
            taskDate = new Date(taskDate.value);
        } else {
            taskDate = new Date();
            taskDate.setHours(0, 0, 0, 0);
        }


        const taskToAdd = new Task(taskName.value, taskDescription.value, taskDate);

        const taskDateString = `${taskDate.getFullYear()}${taskDate.getMonth() + 1}${taskDate.getDate()}`;
        taskToAdd.dayID = taskDateString;

        taskToAdd.initialize();
        taskToAdd.addTask();
        taskToAdd.addEventListenersAt(`day-${taskDateString}`); // it should add it when we add task

        this.tasks = this.localStorage.getTasksForDay(taskDate);
        if (taskDateString === this.dateString) {
            this.updateTasks();
        }
    }

    addTaskFromOutside(task) {
        this.tasks.push(task);
        this.noOfTasks = this.tasks.length;
        this.localStorage.setTasksForDay(this.date, this.tasks);
        this.updateTasks();
    }

    updateTasks() {
        this.dayDOM.updateTasks(this);
        this.tasks.forEach((task) => {
            task.addEventListenersAt(`day-${this.dateString}`);
        });
    }

    addDay() {
        this.dayDOM.addDay(this);
    }
}
