export default class TaskDOM {
   addTask(project, taskName, taskDescription) {
      return `
             <div class="task project-${project.ID}-task-${project.nextTaskID++}">
            <button class="done"></button>
            <div class="task-content d-flex flex-column w-100">
               <div class="task-name">${taskName}</div>
               <div class="task-description">${taskDescription}</div>
            </div>
            <button class="actions">
               <i class="fa-solid fa-ellipsis"></i>
            </button>
         </div>`
   }

   finishTask(project, taskID) {
      const elementToDelete = document.querySelector(`.project-${project.ID}-task-${taskID}`)
      elementToDelete.remove()

      let noOfTasksSpan = document.querySelector('.project-' + project.ID + ' .noOfTasks')
      // noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) - 1
      noOfTasksSpan.textContent = project['tasks'].length
      //TODO Finish task adds up to the counter at the top, removes task from all across the app.
   }
}