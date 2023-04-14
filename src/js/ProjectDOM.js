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
            let taskName = htmlItem.querySelector('.taskName')
            console.log("taskName.value")
            if (taskName.value.length === 0) {
                taskName.style.border = "1px dotted red";
                return;
            }
            taskName.style.border = "none"
            form.style.visibility = "hidden"
            showFormBtn.style.visibility = 'visible'
            taskName.value = ""
        })
    }

    addTasks(project) {
        let projectHTML = document.querySelector(`.project-${project.ID}`);
        let tasksList = projectHTML.querySelector('.tasks-list')
        let tasksHTML = ``
        if (project['tasks'].length === 0)
            return tasksHTML
        project['tasks'].forEach(task => {
            let newTask = new TaskDOM(); console.log(task)
            tasksHTML +=
                newTask.addTask(project, task.name, task.description, task.date)
        })
        tasksList.insertAdjacentHTML('beforeend', tasksHTML)
        return tasksHTML
    }

    addTask(project, name, description, date) {
        const htmlItem = document.querySelector(".project-" + project.ID)
        let taskDOM = new TaskDOM();
        let newTask = taskDOM.addTask(project, name.value, description.value, date.value)
        let tasks = htmlItem.querySelector('.tasks-list')
        tasks.insertAdjacentHTML('beforeend', newTask);//a cookie for all the cross site script attackers

        let noOfTasksSpan = document.querySelector('.project-' + project.ID + ' .noOfTasks')
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) + 1
    }

    finishTask(taskID) {
    }

}
