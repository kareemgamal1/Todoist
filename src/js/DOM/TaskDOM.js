/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
/* eslint-disable no-return-assign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import Day from "../Day";
import Task from "../Task";
import Today from "../Today";
import LocalStorage from "../localStorage";

export default class TaskDOM {
   constructor() {
      this.localStorage = new LocalStorage();
   }

   addTask(task, location) {
      const taskID = task.ID;
      const taskName = task.name;
      const taskDescription = task.description;
      let taskDate = task.date;
      const taskLocation = location;
      const [tDate, isOld] = this.formatTaskDate(taskDate);

      if (taskDate) {
         taskDate = tDate;
      }
      else {
         taskDate = "";
      }
      let oldClass = "";
      if (isOld)
         oldClass = "old";

      return `
             <div class="task ${taskLocation}-task-${taskID}">
            <button class="done"></button>
            <div class="task-content d-flex flex-column w-100">
               <div class="task-name">${taskName}</div>
               <div class="task-description">${taskDescription}</div>
               <div class="task-date-container">
               
            <input type="datetime-local" class="task-date" name="task-date" > 
            <label class="${oldClass}">
            ${taskDate}
            </label>

               </div>
            </div>
            <button class="actions">
               <i class="fa-solid fa-ellipsis"></i>
            </button>
         </div>`;
   }

   finishTask(taskID, project) {
      this.deleteTask(taskID);
      this.updateTotalTaskNumbers();
      if (project)
         this.updateProjectTaskNumbers(project);
   }

   deleteTask(taskID) {
      const elementToDelete = document.querySelectorAll(`[class*="${taskID}"]`);
      elementToDelete?.forEach(e => e.remove());
   }

   updateProjectTaskNumbers(project) {
      const noOfTasksSpan = document.querySelector(`.project-${project.ID} .noOfTasks`);
      noOfTasksSpan.textContent = project.tasks.length;
   }

   updateTotalTaskNumbers() {
      const noOfCompleted = document.querySelector(".no-of-completed");
      noOfCompleted.textContent = parseInt(noOfCompleted.textContent, 10) + 1;
   }

   addEventListeners(task) {
      task.locations.forEach(location => {
         if (!location.includes("day")) {
            const htmlItem = document.querySelector(`.${location}-task-${task.ID}`);
            const editableName = htmlItem.querySelector(".task-name");
            const editableDesc = htmlItem.querySelector(".task-description");

            editableName.addEventListener("click", this.makeTextsEditable.bind(this, editableName));

            editableDesc.addEventListener("click", this.makeTextsEditable.bind(this, editableDesc));

            const dateInput = htmlItem.querySelector(".task .task-date-container .task-date");
            dateInput.addEventListener("change", this.makeDateEditable.bind(this, dateInput));
         }
      });
   }

   addEventListenersAt(task, location) {
      const htmlItem = document.querySelector(`.${location}-task-${task.ID}`);
      const editableName = htmlItem.querySelector(".task-name");
      const editableDesc = htmlItem.querySelector(".task-description");

      editableName.addEventListener("click", this.makeTextsEditable.bind(this, editableName));

      editableDesc.addEventListener("click", this.makeTextsEditable.bind(this, editableDesc));

      const dateInput = htmlItem.querySelector(".task .task-date-container .task-date");
      dateInput.addEventListener("change", this.makeDateEditable.bind(this, dateInput));
   }

   makeTextsEditable(paragraphElement) {
      if (!paragraphElement) {
         return;
      }
      const paragraphClass = paragraphElement.classList;
      const projectHTML = paragraphElement.parentNode.parentNode;
      const projectClasses = projectHTML.classList[1];
      const pattern = /task-(.*)/;
      const match = projectClasses.match(pattern);
      const taskID = match[1];

      const textValue = paragraphElement.textContent;

      // Projects
      let projectID = -1;

      const projects = this.localStorage.getProjects();
      for (const project of projects) {
         for (const task of project.tasks) {
            if (task.ID === taskID) {
               projectID = project.ID;
               break;
            }
         }
      }

      // Replace the paragraph with an input field
      // Check if an input element already exists in the DOM
      let inputElement = paragraphElement.previousElementSibling;
      if (!inputElement || inputElement.tagName !== "INPUT")
         inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.value = textValue;
      inputElement.classList.add("editable-input");
      paragraphElement.parentNode.insertBefore(inputElement, paragraphElement);

      inputElement.onblur = () => {
         // Update the paragraph with the new text
         const updatedTextValue = inputElement.value;
         paragraphElement.textContent = updatedTextValue;
         paragraphElement.style.display = "block";
         inputElement.style.display = "none";

         const projects = this.localStorage.getProjects();
         const projectIndex = projects.findIndex((p) => p.ID === projectID);
         const todayTasks = this.localStorage.getTodayTasks();
         let taskIndex = -1;

         const nodeList = document.querySelectorAll(`[class*="${taskID}"]`);
         let tasksDOM = Array.from(nodeList);
         if (paragraphClass[0].includes("name")) {
            tasksDOM = tasksDOM.map(taskDOM => taskDOM.querySelector(".task-name"));
            tasksDOM.forEach(task => task.textContent = updatedTextValue);

            if (projectIndex !== -1) {
               const tasksDB = projects[projectIndex].tasks;
               const projectTasks = tasksDB.map((task) => {
                  task.taskDOM = new TaskDOM();
                  return Object.assign(new Task(), task);
               }
               );
               taskIndex = projectTasks.findIndex((t) => t.ID === taskID);
               projectTasks[taskIndex].name = updatedTextValue;
               projects[projectIndex].tasks = projectTasks;
            }

            taskIndex = todayTasks.findIndex((t) => t.ID === taskID);
            if (taskIndex !== -1) {
               todayTasks[taskIndex].name = updatedTextValue;
            }
         }
         else {
            tasksDOM = tasksDOM.map(taskDOM => taskDOM.querySelector(".task-description"));
            tasksDOM.forEach(task => task.textContent = updatedTextValue);

            if (projectIndex !== -1) {
               const tasksDB = projects[projectIndex].tasks;
               const projectTasks = tasksDB.map((task) => {
                  task.taskDOM = new TaskDOM();
                  return Object.assign(new Task(), task);
               }
               );
               taskIndex = projectTasks.findIndex((t) => t.ID === taskID);
               projectTasks[taskIndex].description = updatedTextValue;
               projects[projectIndex].tasks = projectTasks;
            }

            taskIndex = todayTasks.findIndex((t) => t.ID === taskID);
            if (taskIndex !== -1) {
               todayTasks[taskIndex].description = updatedTextValue;
            }
         }

         this.localStorage.setProjects(projects);
         this.localStorage.setTodayTasks(todayTasks);
      };

      paragraphElement.style.display = "none";
      inputElement.style.display = "block";
      // Focus on the input field
      inputElement.focus();
   }

   makeDateEditable(input) {
      const date = input.value;

      const projectHTML = input.parentNode.parentNode.parentNode;
      const projectClasses = projectHTML.classList[1];

      const pattern = /task-(.*)/;
      const match = projectClasses.match(pattern);
      const taskID = match[1];

      // Projects
      this.editDateInProjects(taskID, date);
      // Today
      this.editDateInToday(taskID, date);
      // Day
      this.editDateInDay(taskID, date);
      // Tasks
      this.editDateInTasks(taskID, date);
      // DOM
      this.editDateInDOM(taskID, date);
   }

   editDateInProjects(taskID, date) {
      let projectID = -1;

      const projects = this.localStorage.getProjects();
      const task = projects.flatMap(project => project.tasks).find(t => t.ID === taskID);

      if (task) {
         projectID = task.projectID;
      }

      const projectIndex = projects.indexOf(projects.find(project => project.ID === projectID));
      if (projectIndex !== -1) {
         const tasksDB = projects[projectIndex].tasks;
         const projectTasks = tasksDB.map((t) => {
            t.taskDOM = new TaskDOM();
            return Object.assign(new Task(), t);
         }
         );

         const projectTaskIndex = projectTasks.findIndex((t) => t.ID === taskID);
         projectTasks[projectTaskIndex].date = date;
         projects[projectIndex].tasks = projectTasks;

         this.localStorage.setProjects(projects);
      }
   }

   editDateInToday(taskID, date) {
      const task = this.localStorage.getTask(taskID);
      date = new Date(date);
      const todayDate = new Date();
      const isToday = date.getDate() === todayDate.getDate() &&
         date.getMonth() === todayDate.getMonth() &&
         date.getFullYear() === todayDate.getFullYear();
      if (isToday) {
         task.date = date;
         const today = new Today();
         today.addTaskFromOutside(task);
      }
      else {
         let todayTasks = this.localStorage.getTodayTasks();
         todayTasks = todayTasks.filter(t => t.ID !== taskID);
         this.localStorage.setTodayTasks(todayTasks);
      }
   }

   editDateInDay(taskID, date) {
      // Get all days, remove task from the current day, put it in the day with it's date as the date paramater
      date = new Date(date);
      const task = this.localStorage.getTask(taskID);

      let oldTasks = this.localStorage.getDayTasks(task.date);
      const newTasks = this.localStorage.getDayTasks(date);

      oldTasks = oldTasks.filter(t => t.ID !== taskID);
      this.localStorage.setTasksForDay(task.date, oldTasks);

      task.date = date;
      newTasks.push(task);
      this.localStorage.setTasksForDay(date, newTasks);
   }

   editDateInTasks(taskID, date) {
      date = new Date(date);
      const tasks = this.localStorage.getTasks();
      tasks.forEach(t => {
         if (t.ID === taskID) {
            t.date = date;
            t.dayID = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
         }
      });
      this.localStorage.setTasks(tasks);
   }

   editDateInDOM(taskID, date) {
      date = new Date(date);

      this.editDateInDayDOM(taskID, date);

      const nodeList = document.querySelectorAll(`[class*= "${taskID}"]`);
      const dateTexts = Array.from(nodeList).map(dateText => dateText.querySelector(".task-date").nextElementSibling);
      const [formattedDate, old] = this.formatTaskDate(date);
      dateTexts.forEach(dateText => {
         dateText.innerText = formattedDate;
         if (old) {
            dateText.classList.add("old");
            dateText.classList.remove("new");
         } else {
            dateText.classList.remove("old");
            dateText.classList.add("new");
         }
      });

      const todaytasks = new Today();
      todaytasks.updateTasks();
   }

   editDateInDayDOM(taskID, date) {
      const task = this.localStorage.getTask(taskID);
      let oldLoc = "";
      let isUpcoming = false;
      const newLoc = `day-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;

      task.locations.forEach((location, i, arr) => {
         if (location.includes("day-")) {
            isUpcoming = true;
            oldLoc = location;
            arr[i] = `day-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;

         }
      });
      if (!isUpcoming) {
         task.locations.push(newLoc);
      }
      this.localStorage.setTask(taskID, task); // updates new location in task
      // Remove task from oldDayHTML, add it to newDayHTML, add event listener to it and sort it (using update tasks)
      // What if either the old or new day are yet to be rendered? handled by the if conditions
      if (oldLoc) {
         const oldDayHTML = document.querySelector(`.${oldLoc} `);
         if (oldDayHTML) {
            const taskInOld = oldDayHTML.querySelector(`[class*= "${taskID}"]`);
            taskInOld.remove();
         }
      }
      const newDayHTML = document.querySelector(`.${newLoc}`);
      if (newDayHTML) {
         const day = new Day(date);

         day.updateTasks();
      }
   }

   formatTaskDate(taskDate) {
      taskDate = new Date(taskDate);
      let date = taskDate;
      const options = { day: "numeric", month: "short", hour: "numeric", minute: "numeric", hour12: true };
      let old = false;
      const currentDate = new Date();
      const taskDateLocale = taskDate.toLocaleDateString("en-US", options);


      if (taskDate <= currentDate)
         old = true;
      else
         old = false;
      date = taskDateLocale;

      if (taskDate.toDateString() === currentDate.toDateString()) {
         const time = taskDateLocale.match(/[^,]*$/g);
         date = `Today at${time[0]}`;
      }


      return [date, old];
   }
}