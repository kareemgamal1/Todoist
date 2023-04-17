import TaskDOM from "./TaskDOM"

export default class ProjectDOM {
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
            if (taskName.value.length === 0) {
                taskName.style.border = "1px dotted red";
                return;
            }
            taskName.style.border = "none"
            taskName.value = ""

            form.style.visibility = "hidden"
            showFormBtn.style.visibility = 'visible'
        })
    }

    updateTasks(project) {
        let projectHTML = document.querySelector(`.project-${project.ID}`);
        let tasksList = projectHTML.querySelector('.tasks-list')
        let tasksHTML = ``
        if (project['tasks'].length === 0)
            return tasksHTML

        project.tasks.sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
        })

        project['tasks'].forEach(task => {
            let newTask = new TaskDOM();
            tasksHTML +=
                newTask.addTask(project, task.name, task.description, new Date(task.date))
        })
        tasksList.innerHTML = tasksHTML
        return tasksHTML
    }

    addTask(project, name, description, date) {
        const htmlItem = document.querySelector(".project-" + project.ID)
        let taskDOM = new TaskDOM();

        if (!date)
            date = ""

        let newTask = taskDOM.addTask(project, name.value, description.value, date)
        let tasks = htmlItem.querySelector('.tasks-list')
        tasks.insertAdjacentHTML('beforeend', newTask);//a cookie for all the cross site script attackers

        let noOfTasksSpan = document.querySelector('.project-' + project.ID + ' .noOfTasks')
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) + 1
    }
}
