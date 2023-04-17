export default class TaskDOM {
   addTask(project, taskName, taskDescription, taskDate) {
      let [tDate, old] = this.formatTaskDate(taskDate)
      taskDate = tDate
      let oldClass = ""
      if (old)
         oldClass = "old"
      return `
             <div class="task project-${project.ID}-task-${project.nextTaskID++}">
            <button class="done"></button>
            <div class="task-content d-flex flex-column w-100">
               <div class="task-name">${taskName}</div>
               <div class="task-description">${taskDescription}</div>
               <div class="task-date">
               
            <input type="datetime-local" name="task-date" > 
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

   finishTask(project, taskID) {
      this.deleteTask(project, taskID)
      this.updateTaskNumbers(project)
   }

   deleteTask(project, taskID) {
      const elementToDelete = document.querySelector(`.project-${project.ID}-task-${taskID}`)
      elementToDelete.remove()
   }

   updateTaskNumbers(project) {
      let noOfTasksSpan = document.querySelector('.project-' + project.ID + ' .noOfTasks')
      noOfTasksSpan.textContent = project['tasks'].length
      let noOfCompleted = document.querySelector('.no-of-completed')
      noOfCompleted.textContent = parseInt(noOfCompleted.textContent) + 1
   }

   formatTaskDate(taskDate) {
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

      console.log(old)
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