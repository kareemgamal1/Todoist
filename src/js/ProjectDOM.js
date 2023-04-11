import TaskDOM from "./TaskDOM"

export default class ProjectDOM {
    constructor() {

    }

    addEventListeners(project) {
        const htmlItem = document.querySelector(".project-" + project.ID)
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
        })
    }

    addTasks(project) {
        let projectHTML = document.querySelector(`.project-${project.ID}`);
        let tasksList = projectHTML.querySelector('.tasks-list')
        let tasksHTML = ``
        if (project['tasks'].length === 0)
            return tasksHTML
        project['tasks'].forEach(task => {
            let newTask = new TaskDOM();
            tasksHTML +=
                newTask.addTask(project, task.name, task.description)
        })
        tasksList.insertAdjacentHTML('beforeend', tasksHTML)
        return tasksHTML
    }

    addTask(project, name, description) {
        const htmlItem = document.querySelector(".project-" + project.ID)
        let taskDOM = new TaskDOM();
        let newTask = taskDOM.addTask(project, name.value, description.value)
        let tasks = htmlItem.querySelector('.tasks-list')
        tasks.insertAdjacentHTML('beforeend', newTask);//a cookie for all the cross site script attackers

        let noOfTasksSpan = document.querySelector('.project-' + project.ID + ' .noOfTasks')
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) + 1
        name.value = ""
    }

    finishTask(taskID) {
        let noOfCompleted = document.querySelector('.no-of-completed')
        noOfCompleted.textContent = parseInt(noOfCompleted.textContent) + 1
    }

}
