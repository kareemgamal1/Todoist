export default class ProjectDOM {
    constructor() {

    }

    addEventListeners(project) {
        const htmlItem = document.querySelector(".project-" + project.key)
        let showFormBtn = htmlItem.querySelector(".show-task-form")
        let form = htmlItem.querySelector('form')
        let cancelBtn = htmlItem.querySelector(".cancel-task")
        let addTaskBtn = htmlItem.querySelector('.submit-task')
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
            let newTask = this.addTask(taskName.value, taskDescription.value)
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
            tasksHTML += this.addTask(task['name'], task['description'])
        })
        return tasksHTML
    }

    addTask(taskName, taskDescription) {
        return `<div class="task">
    <button class="done"></button>
    <div class="task-name">${taskName}</div>
    <div className="task-description">${taskDescription}</div>
    <button class="actions">
      <i class="fa-solid fa-ellipsis"></i>
    </button>
    </div>`
    }
}
