import Task from "./Task"
import LocalStorage from "./localStorage"

export default class TaskDOM {
   constructor() {
      this.localStorage = new LocalStorage()
   }
   addTask(project, task) {
      let taskID = task.ID
      let taskName = task.name
      let taskDescription = task.description
      let taskDate = task.date


      let [tDate, old] = this.formatTaskDate(taskDate)
      if (taskDate) {
         taskDate = tDate
      }
      else {
         taskDate = ""
      }
      let oldClass = ""
      if (old)
         oldClass = "old"

      return `
             <div class="task project-${project.ID}-task-${taskID}">
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
         </div>`
   }

   updateTask(project, task) {

   }

   finishTask(project, taskID) {
      this.deleteTask(project, taskID)
      this.updateTaskNumbers(project)
   }

   deleteTask(project, taskID) {
      const elementToDelete = document.querySelector(`.project-${project.ID}-task-${taskID}`)
      elementToDelete.remove()
   }



   addEventListeners(task) {
      const htmlItem = document.querySelector(".project-" + task.projectID + '-task-' + task.ID)
      const editableName = htmlItem.querySelector(".task-name");
      const editableDesc = htmlItem.querySelector(".task-description");

      editableName.addEventListener('click', this.makeTextsEditable.bind(this, editableName));

      editableDesc.addEventListener('click', this.makeTextsEditable.bind(this, editableDesc));

      const dateInput = htmlItem.querySelector('.task .task-date-container .task-date')
      dateInput.addEventListener('change', this.makeDateEditable.bind(this, dateInput))
   }

   makeTextsEditable(paragraphElement) {
      if (!paragraphElement) {
         return;
      }
      const paragraphClass = paragraphElement.classList
      const projectHTML = paragraphElement.parentNode.parentNode
      const projectClasses = projectHTML.classList[1]
      const myRegex = /-(\d+)/g;
      const [projectID, taskID] = projectClasses.match(myRegex).map(match => parseInt(match.slice(1)));
      const textValue = paragraphElement.textContent;

      // Replace the paragraph with an input field
      // Check if an input element already exists in the DOM
      let inputElement = paragraphElement.previousElementSibling;
      if (!inputElement || inputElement.tagName !== "INPUT")
         inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.value = textValue;
      inputElement.classList.add("editable-input")
      paragraphElement.parentNode.insertBefore(inputElement, paragraphElement);

      inputElement.onblur = () => {
         // Update the paragraph with the new text
         const updatedTextValue = inputElement.value;
         paragraphElement.textContent = updatedTextValue;
         paragraphElement.style.display = "block";
         inputElement.style.display = "none";

         let projects = this.localStorage.getProjects()
         const projectIndex = projects.findIndex((p) => p.ID == projectID)

         const tasksDB = projects[projectIndex]['tasks']
         let newTasks = tasksDB.map((task) => {
            task.taskDOM = new TaskDOM()
            return Object.assign(new Task(), task)
         }
         )
         if (paragraphClass[0].includes("name")) {
            newTasks[taskID].name = updatedTextValue
         }
         else {
            newTasks[taskID].description = updatedTextValue
         }
         projects[projectIndex].tasks = newTasks
         this.localStorage.setProjects(projects)
      }

      paragraphElement.style.display = "none";
      inputElement.style.display = "block";
      // Focus on the input field
      inputElement.focus();
   }

   makeDateEditable(input) {
      const projectHTML = input.parentNode.parentNode.parentNode
      const projectClasses = projectHTML.classList[1]
      const myRegex = /-(\d+)/g;
      const [projectID, taskID] = projectClasses.match(myRegex).map(match => parseInt(match.slice(1)));
      let projects = this.localStorage.getProjects()
      const projectIndex = projects.findIndex((p) => p.ID == projectID)

      const tasksDB = projects[projectIndex]['tasks']
      let newTasks = tasksDB.map((task) => {
         task.taskDOM = new TaskDOM()
         return Object.assign(new Task(), task)
      }
      )
      newTasks[taskID].date = input.value
      projects[projectIndex].tasks = newTasks
      this.localStorage.setProjects(projects)

      const dateText = input.nextElementSibling
      let [formattedDate, old] = this.formatTaskDate(input.value)
      dateText.innerText = formattedDate
      dateText.classList.add(old ? 'old' : '')
   }

   updateTaskNumbers(project) {
      let noOfTasksSpan = document.querySelector('.project-' + project.ID + ' .noOfTasks')
      noOfTasksSpan.textContent = project['tasks'].length
      let noOfCompleted = document.querySelector('.no-of-completed')
      noOfCompleted.textContent = parseInt(noOfCompleted.textContent) + 1
   }

   formatTaskDate(taskDate) {
      taskDate = new Date(taskDate)
      var options = { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true };
      let old = false
      const currentDate = new Date()
      let taskDateLocale = taskDate.toLocaleDateString("en-US", options)

      if (taskDate.getDate() == currentDate.getDate()) {
         let time = taskDateLocale.match(/[^,]*$/g)
         if (taskDate.getHours()) {
            taskDate = "Today at" + time[0]
         }
         else
            taskDate = "Today"
      }
      else if (taskDate.getDate() < currentDate.getDate()) {
         old = true
         taskDate = taskDateLocale
      } else
         taskDate = ""

      return [taskDate, old]
   }

   deleteChecked() {
      let listings = document.querySelectorAll('.c4mnd7m ')
      listings.forEach((list) => {
         let btn = list.querySelector('.l1j9v1wn.bq05a0m.vq7srz5')
         if (btn.ariaLabel.includes("Remove"))
            list.parentElement.remove()
      }
      )
   }
}