import Task from "./Task";
import TodayDOM from "./TodayDOM";
import LocalStorage from "./localStorage";

export default class Today {
    constructor() {
        this.localStorage = new LocalStorage()
        this.projects = this.localStorage.getProjects()
        this.todayDOM = new TodayDOM()
        this.tasks = []
    }

    initialize() {
        this.projects.forEach(project => {
            project.tasks.forEach(task => {
                this.tasks.push(task)
            })
        })
        let today = new Date()

        this.tasks = this.tasks.filter((task) =>
            new Date(task.date).toDateString() === today.toDateString()
        )
        this.todayDOM.initialize(this)
    }

    addTask() {
        const htmlItem = document.querySelector(".today")
        let taskName = htmlItem.querySelector('.taskName')
        let taskDescription = htmlItem.querySelector('.taskDescription')
        let taskDate = htmlItem.querySelector('.taskDate')

        if (taskName.value.length === 0) {
            return;
        }

        if (taskDate.value) {
            taskDate = new Date(taskDate.value)
        }
        else {
            taskDate = new Date()
            taskDate.setHours(0, 0, 0, 0);
        }

        const taskToAdd = new Task(this.nextTaskID++, taskName.value, taskDescription.value, taskDate, this.ID)

        let projects = this.localStorage.getProjects()
        const projectIndex = projects.findIndex((p) => p.ID == this.ID)

        const tasksDB = projects[projectIndex]['tasks']

        let newTasks = tasksDB.map((task) => {
            task.taskDOM = new TaskDOM()
            return Object.assign(new Task(), task)
        }
        )

        this.tasks = newTasks
        this.tasks.push(taskToAdd)
        this['noOfTasks'] = this['tasks'].length;
        projects[projectIndex] = this
        this.localStorage.setProjects(projects)

        this.projectDOM.addTask(this, taskToAdd)
        this.updateTasks()
    }

    addEventListeners() {
        const htmlItem = document.querySelector(".today")
        let deleteProject = htmlItem.querySelector('.deleteProject')
        let addTaskBtn = htmlItem.querySelector('.submit-task')

        // deleteProject.addEventListener('click', () => {
        // this.deleteProject()
        // })

        addTaskBtn.addEventListener('click', () => {
            this.addTask();
        }
        )
        this.todayDOM.addEventListeners(this)
    }

    updateTasks() {
        this.todayDOM.updateTasks(this);
        this.tasks.forEach((task) => {
            task.addEventListeners()
        })
    }
}
new Today().initialize()
