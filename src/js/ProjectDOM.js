export default class ProjectDOM {
    constructor() {
    }

    addEventListeners(project) {
        console.log(project.ID)
        const htmlItem = document.querySelector(".project-" + project.ID)
        console.log(htmlItem)
        let showFormBtn = htmlItem.querySelector(".show-task-form")
        let form = htmlItem.querySelector('form')
        let cancelBtn = htmlItem.querySelector(".cancel-task")
        let addTaskBtn = htmlItem.querySelector('.submit-task')
        showFormBtn.addEventListener('click', () => {
            console.log("ASD")

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
            tasksHTML +=
                `<div class="task">
    <button class="done"></button>
    <div class="task-name">${task['name']}</div>
    <div className="task-description">${task['description']}</div>
    <button class="actions">
      <i class="fa-solid fa-ellipsis"></i>
    </button>
    </div>`
        })
        return tasksHTML
    }

    addTask(project, taskName, taskDescription) {
        project['noOfTasks']++;
        let noOfTasksSpan = document.querySelector('.project-' + project['ID'] + ' .noOfTasks')
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) + 1
        return `<div class="task">
    <button class="done"></button>
    <div class="task-name">${taskName}</div>
    <div className="task-description">${taskDescription}</div>
    <button class="actions">
      <i class="fa-solid fa-ellipsis"></i>
    </button>
    </div>`
    }

    finishTask(project, taskName, taskDescription) {
        project['noOfTasks']--;
        let noOfTasksSpan = document.querySelector('.project-' + project['key'] + ' .noOfTasks')
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) - 1
        //TODO Finish task adds up to the counter at the top, removes task from all across the app.
    }
}
