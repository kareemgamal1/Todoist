import TaskDOM from "./TaskDOM"
import LocalStorage from "../localStorage";

export default class ProjectDOM {
    constructor() {
        this.localStorage = new LocalStorage()
    }

    addProject(project) {
        let projectName = project['name']
        projectName = projectName === '' ? 'Unnamed Project' : projectName

        let projectHtml = `
    <div class="project-${project.ID} mb-4">
    <div class="project-heading d-flex gap-1 align-items-center"><strong class="project-name">(${projectName})</strong>
        <span class="noOfTasks">${project.noOfTasks}</span>
        <button class="btn deleteProject">
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

        let projectsHtml = document.querySelector(".projects");
        projectsHtml.insertAdjacentHTML('beforeend', projectHtml);//a cookie for all the cross site script attackers

        project.tasks.forEach(task => {
            task.location = `project-${project.ID}`
        })
        project.updateTasks()
        // project.addEventListeners()
    }

    deleteProject(project) {
        const projectHTML = document.querySelector(`.project-${project.ID}`)
        projectHTML.remove()
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

        const editableProject = htmlItem.querySelector(".project-name");

        editableProject.addEventListener('click', this.makeProjectEditable.bind(this, editableProject));
    }

    updateTasks(project) {
        let projectHTML = document.querySelector(`.project-${project.ID}`);
        let tasksList = projectHTML.querySelector('.tasks-list')
        let tasksHTML = ``

        project.tasks.sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
        })

        project.tasks.forEach(task => {
            const location = `project-${project.ID}`
            let newTask = new TaskDOM();
            tasksHTML +=
                newTask.addTask(task, location)
        })
        tasksList.innerHTML = tasksHTML
        // project.tasks.forEach(task => {
        //     task.addEventListenersAt(`project-${project.ID}`)
        // })
    }

    addTask(task) {
        const htmlItem = document.querySelector(`.${task.location}`)
        let taskDOM = new TaskDOM();

        let newTask = taskDOM.addTask(this)
        let tasks = htmlItem.querySelector('.tasks-list')
        tasks.innerHTML += newTask

        let noOfTasksSpan = document.querySelector(`.${task.location} .noOfTasks`)
        noOfTasksSpan.textContent = parseInt(noOfTasksSpan.textContent) + 1
    }

    makeProjectEditable(paragraphElement) {
        if (!paragraphElement) {
            return;
        }

        const projectHTML = paragraphElement.parentNode.parentNode
        const projectClasses = projectHTML.classList[0]
        const myRegex = /(?<=project-)[^-]+/;
        const projectID = projectClasses.match(myRegex)[0];

        const textValue = paragraphElement.textContent;

        // Replace the paragraph with an input field
        // Check if an input element already exists in the DOM
        let inputElement = paragraphElement.previousElementSibling;
        let noOfTasks = paragraphElement.nextElementSibling;

        if (!inputElement || inputElement.tagName !== "INPUT")
            inputElement = document.createElement("input");
        inputElement.type = "text";
        const myRegex2 = /\(([^)]+)\)/;
        const result = textValue.match(myRegex2)[1];
        inputElement.value = result;
        inputElement.classList.add("editable-input")
        paragraphElement.parentNode.insertBefore(inputElement, paragraphElement);

        inputElement.onblur = () => {
            // Update the paragraph with the new text
            const updatedTextValue = inputElement.value;
            paragraphElement.textContent = `(${updatedTextValue})`;
            noOfTasks.style.display = 'block'
            paragraphElement.style.display = "block";
            inputElement.style.display = "none";
            this.localStorage.updateProject(projectID, updatedTextValue)

        }
        noOfTasks.style.display = 'none'
        paragraphElement.style.display = "none";
        inputElement.style.display = "block";
        // Focus on the input field
        inputElement.focus();
    }
}
