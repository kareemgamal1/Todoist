import Project from "./Project";
import Task from "./Task"
import TaskDOM from "./TaskDOM"

export default class ProjectDOM {
    constructor(project) {
        this.localStorage = project.localStorage

        this.form = document.querySelector(".new-project");
        this.addProj = document.querySelector(".add-project-btn");
        this.cancelFormBtn = document.querySelector('.new-project .cancel-add')

        this.addProj.addEventListener("click", () => {
            this.showForm()
        });


        this.cancelFormBtn.addEventListener('click', () => {
            this.hideForm()
        })

    }

    addProject(project) {
        let projectName = project['name']
        projectName = projectName === '' ? 'Unnamed Project' : projectName

        let projectHtml = `
    <div class="project-${project.ID} mb-4">
    <div class="project-heading d-flex gap-1 align-items-center"><strong class="project-name">(${projectName})</strong>
        <span class="noOfTasks">${project.noOfTasks}</span>
        <button class="btn deleteTask">
        <i class="fa fa-trash" aria-hidden="true"></i>
        </button>
    </div>
    <div class="tasks-list">
        
    </div>
    <button class="btn show-task-form">
        <span>
        <i class="fa-solid fa-plus fa-xl pe-1"></i>
        </span>
        Add task</button>
        <form class="w-100 d-flex flex-column task-form">                  
          <input type="text" placeholder="Name" class="taskName">
          <input type="text" placeholder="Description" class="taskDescription">

          <div className="control">
            <input type="datetime-local" class="taskDate" onclick="this.showPicker()" >
            <div className="control-form">
            <button type="button" class="btn btn-light cancel-task">Cancel</button>
            <button type="button" class="btn btn-dark submit-task">Add task</button>
            </div>
          </div>

        </form>
  </div>
  `

        this.hideForm()

        let projectsHtml = document.querySelector(".projects");
        projectsHtml.insertAdjacentHTML('beforeend', projectHtml);//a cookie for all the cross site script attackers
        project = new Project(project.ID, project.name, ...project.tasks)
        project.updateTasks()
        project.addEventListeners()
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

            let taskName = htmlItem.querySelector('.taskName')
            let taskDescription = htmlItem.querySelector('.taskDescription')
            let taskDate = htmlItem.querySelector('.taskDate')

            taskName.style.border = "none"
            taskName.value = ""
            taskDescription.value = ""

            const now = new Date();
            const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
            const isoDate = localDate.toISOString().slice(0, 16);
            taskDate.value = isoDate
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

            form.style.visibility = "hidden"
            showFormBtn.style.visibility = 'visible'
        })

        const editableNames = htmlItem.querySelectorAll(".task-name");
        const editableDescs = htmlItem.querySelectorAll(".task-description");


        editableNames.forEach((p) => {
            p.addEventListener('click', this.makeEditable.bind(this, p));
        })
        editableDescs.forEach((p) => {
            p.addEventListener('click', this.makeEditable.bind(this, p));
        })

        const dateInputs = htmlItem.querySelectorAll('.task .task-date-container .task-date')
        dateInputs.forEach((input) => {
            input.addEventListener('change', this.makeDateEditable.bind(this, input))
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
                newTask.addTask(project, task)
        })
        tasksList.innerHTML = tasksHTML
        return tasksHTML
    }

    addTask(project, task) {
        const htmlItem = document.querySelector(".project-" + project.ID)
        let taskDOM = new TaskDOM();

        let newTask = taskDOM.addTask(project, task)
        console.log(newTask)
        let tasks = htmlItem.querySelector('.tasks-list')
        tasks.innerHTML += newTask
        // tasks.insertAdjacentHTML('beforeend', newTask);//a cookie for all the cross site script attackers

        let noOfTasksSpan = document.querySelector('.project-' + project.ID + ' .noOfTasks')
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) + 1
    }

    makeEditable(paragraphElement) {
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
        dateText.innerText = input.value
        console.log(dateText)
    }

    showForm() {
        this.addProj.classList.add("d-none");
        this.form.classList.remove("d-none");
    }

    hideForm() {
        this.addProj.classList.remove("d-none");
        this.form.classList.add("d-none");
    }

}
