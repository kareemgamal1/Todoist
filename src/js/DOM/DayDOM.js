/* eslint-disable import/no-cycle */
/* eslint-disable class-methods-use-this */
import LocalStorage from "../localStorage";
import TaskDOM from "./TaskDOM";

export default class DayDOM {
  constructor(tasks, date, dateString) {
    this.tasks = tasks;
    this.date = new Date(date);
    this.dateString = dateString;
    this.localStorage = new LocalStorage();
  }

  initialize() {
    this.tasks = this.localStorage.getDayTasks(this.date);

    this.tasks.forEach((task) => {
      const taskLocation = `day-${this.dateString}`;
      const htmlItem = document.querySelector(`.${taskLocation}`);
      const taskDOM = new TaskDOM();
      const newTask = taskDOM.addTask(task, taskLocation);
      const tasks = htmlItem.querySelector(".tasks-list");
      tasks.innerHTML += newTask;
    });
  }


  addEventListeners() {
    const htmlItem = document.querySelector(`.day-${this.dateString}`);
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

      // Sets input date to day date
      const now = new Date(this.date);
      const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
      const isoDate = localDate.toISOString().slice(0, 16);
      taskDate.value = isoDate;
    });

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

  addDay(day) {
    const options = { day: "numeric", month: "long", weekday: "long" };
    let formattedDate = new Intl.DateTimeFormat("en-US", options).format(this.date);
    const [weekdayText, monthText, dayText] = formattedDate.split(" ");
    formattedDate = `${dayText} ${monthText} ‧ ${weekdayText.slice(0, -1)}`;// slice removes trailing comma from weekday 
    // 13 June ‧ Tuesday

    // Check if date is today or tomorrow
    const today = new Date();
    const isToday = this.date.getDate() === today.getDate()
      && this.date.getMonth() === today.getMonth()
      && this.date.getFullYear() === today.getFullYear();

    const isTomorrow = this.date.getDate() === today.getDate() + 1
      && this.date.getMonth() === today.getMonth()
      && this.date.getFullYear() === today.getFullYear();

    if (isToday) {
      formattedDate = `${dayText} ${monthText} ‧ Today ‧ ${weekdayText.slice(0, -1)}`;
    } else if (isTomorrow) {
      formattedDate = `${dayText} ${monthText} ‧ Tomorrow ‧ ${weekdayText.slice(0, -1)}`;
    }

    const dayHTML = `
                        <div class="heading d-flex gap-1 align-items-center">
                    <small>${formattedDate}</small>
                    </div>
                    <hr class="day-seperator m-0 mb-1"></hr>
        <div class="day-${this.dateString}">
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

    const daysHTML = document.querySelector(".upcoming-page");
    daysHTML.insertAdjacentHTML("beforeend", dayHTML);// a cookie for all the cross site script attackers

    day.addEventListeners();
    return dayHTML;
  }


  updateTasks(day) {
    // Find the HTML element for the current day
    const dayHTML = document.querySelector(`.day-${day.dateString}`);

    // If the HTML element exists
    if (dayHTML) {
      // Find the HTML element for the tasks list
      const tasksList = dayHTML.querySelector(".tasks-list");

      // Sort the tasks for the day by date
      day.tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Generate the HTML for each task and add it to the tasks list
      tasksList.innerHTML = day.tasks.reduce((tasksHTML, task) => {
        // Define the location for the new task
        const location = `day-${day.dateString}`;
        // Create a new TaskDOM instance
        const newTask = new TaskDOM();
        // Add the HTML for the task to the accumulated tasksHTML value
        return tasksHTML + newTask.addTask(task, location);
      }, "");
    }
  }
}
