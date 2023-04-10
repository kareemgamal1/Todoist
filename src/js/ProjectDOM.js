import Inbox from "./Inbox"
import Task from "./Task"

export default class ProjectDOM {
    constructor() {
    }

    addEventListeners(project) {
        const htmlItem = document.querySelector(".project-" + project.ID)
        let finishtask = htmlItem.querySelectorAll('.done')
        let showFormBtn = htmlItem.querySelector(".show-task-form")
        let form = htmlItem.querySelector('form')
        let cancelBtn = htmlItem.querySelector(".cancel-task")
        let addTaskBtn = htmlItem.querySelector('.submit-task')

        finishtask.forEach(btn => {
            btn.addEventListener('click', () => {
                const taskHTML = btn.parentElement
                let elementClass = taskHTML.classList[1].match(/\d+/g)
                let projectID = elementClass[0]
                let taskID = elementClass[1]
                this.finishTask(project, taskID)
            })
        })

        showFormBtn.addEventListener('click', () => {
            form.style.visibility = "visible"
            showFormBtn.style.visibility = "hidden"
        }
        )

        cancelBtn.addEventListener('click', () => {
            form.style.visibility = "hidden"
            showFormBtn.style.visibility = 'visible'
        })

        addTaskBtn.addEventListener('click', () => {
            form.style.visibility = "hidden"
            showFormBtn.style.visibility = 'visible'

            let taskName = htmlItem.querySelector('.taskName')
            let taskDescription = htmlItem.querySelector('.taskDescription')
            let newTask = this.addTask(project, taskName.value, taskDescription.value)
            let tasks = htmlItem.querySelector('.tasks-list')
            tasks.insertAdjacentHTML('beforeend', newTask);//a cookie for all the cross site script attackers
            taskName.value = ""
        })
    }

    addTasks(project) {
        let tasksHTML = ``
        if (project['tasks'].length === 0)
            return tasksHTML
        project['tasks'].forEach(task => {
            console.log(project.ID)

            tasksHTML +=
                this.TaskDOM(project, task.name, task.description)
        })
        return tasksHTML
    }

    addTask(project, taskName, taskDescription) {
        project['noOfTasks']++;
        project['tasks'].push(new Task(project.ID, taskName, taskDescription))
        let noOfTasksSpan = document.querySelector('.project-' + project['ID'] + ' .noOfTasks')
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) + 1
        return this.TaskDOM(project, taskName, taskDescription)
    }

    TaskDOM(project, taskName, taskDescription) {
        console.log(document.querySelector("input[type=date]"))
        return `
             <div class="task project-${project.ID}-task-${project.taskID++}">
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
        project['tasks'] = project['tasks'].filter(obj => {
            return obj.ID !== parseInt(taskID);
        })
        project['noOfTasks']--;

        const elementToDelete = document.querySelector(`.project-${project.ID}-task-${taskID}`)
        elementToDelete.remove()

        let noOfTasksSpan = document.querySelector('.project-' + project.ID + ' .noOfTasks')
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) - 1
        //TODO Finish task adds up to the counter at the top, removes task from all across the app.
    }
}
