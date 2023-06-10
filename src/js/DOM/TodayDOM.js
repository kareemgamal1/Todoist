/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import TaskDOM from "./TaskDOM";

export default class TodayDOM {
    initialize(today) {
        const date = new Date();
        const formattedDate = date.toLocaleString("en-us", { weekday: "short", day: "numeric", month: "short" });
        const tasksHTML = `
                        <div class="heading d-flex gap-1 align-items-center">
                    <h4><strong>Today</strong></h4>
                    <small>${formattedDate}</small>
                </div>
        <div class="today">
<div class="tasks-list">
    </div>
    <button class="btn show-task-form">
        <span>
        <i class="fa-solid fa-plus fa-xl pe-1"></i>
        </span>
        Add task</button>
        <form class="w-100 d-flex flex-column task-form">                  
          <input type="text" placeholder="Name" class="taskName">
          <input type="text" placeholder="Description" class="taskDescription">

          <div className="control">
            <input type="datetime-local" class="taskDate" onclick="this.showPicker()" >
            <div className="control-form">
            <button type="button" class="btn btn-light cancel-task">Cancel</button>
            <button type="button" class="btn btn-dark submit-task">Add task</button>
            </div>
          </div>

        </form>
  </div>
        </div>
    
  `;

        const todayHTML = document.querySelector(".today-page");
        todayHTML.insertAdjacentHTML("beforeend", tasksHTML);// a cookie for all the cross site script attackers
        today.updateTasks();
        today.addEventListeners();
    }

    addTask(task) {
        const htmlItem = document.querySelector(".today-page .today");
        const taskDOM = new TaskDOM();
        const newTask = taskDOM.addTask(task, task.dayID);
        const tasks = htmlItem.querySelector(".tasks-list");
        tasks.innerHTML += newTask;
    }


    updateTasks(today) {
        const todayHTML = document.querySelector(".today-page");
        const tasksList = todayHTML.querySelector(".tasks-list");
        let tasksHTML = "";
        if (today.tasks.length === 0)
            tasksList.innerHTML = tasksHTML;

        today.tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

        today.tasks.forEach(task => {
            task.locationID = "1";
            task.location = "today";
            const newTask = new TaskDOM();
            tasksHTML +=
                newTask.addTask(task, "today");
        });
        tasksList.innerHTML = tasksHTML;
    }

    addEventListeners() {
        const htmlItem = document.querySelector(".today-page");
        const showFormBtn = htmlItem.querySelector(".show-task-form");
        const form = htmlItem.querySelector("form");
        const cancelBtn = htmlItem.querySelector(".cancel-task");
        const addTaskBtn = htmlItem.querySelector(".submit-task");

        showFormBtn.addEventListener("click", () => {
            form.style.visibility = "visible";
            showFormBtn.style.visibility = "hidden";

            const taskName = htmlItem.querySelector(".taskName");
            const taskDescription = htmlItem.querySelector(".taskDescription");
            const taskDate = htmlItem.querySelector(".taskDate");

            taskName.style.border = "none";
            taskName.value = "";
            taskDescription.value = "";

            const now = new Date();
            const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
            const isoDate = localDate.toISOString().slice(0, 16);
            taskDate.value = isoDate;
        }
        );

        cancelBtn.addEventListener("click", () => {
            form.style.visibility = "hidden";
            showFormBtn.style.visibility = "visible";
        });

        addTaskBtn.addEventListener("click", () => {
            const taskName = htmlItem.querySelector(".taskName");
            if (taskName.value.length === 0) {
                taskName.style.border = "1px dotted red";
                return;
            }

            form.style.visibility = "hidden";
            showFormBtn.style.visibility = "visible";
        });

    }

}