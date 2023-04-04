import TasksList from "./TasksList";


export default class Project {
  constructor() {
    this.addNew = document.querySelector(".add-project-btn");
    this.form = document.querySelector(".new-project");
    this.addFormBtn = document.querySelector(".new-project .add");
    this.cancelFormBtn = document.querySelector('.new-project .cancel-add')
    this.projects = document.querySelector(".projects");

    this.addNew.addEventListener("click", () => {
      this.addNew.classList.add("d-none");
      this.form.classList.remove("d-none");
    });

    this.addFormBtn.addEventListener("click", () => {
      let newName = document.querySelector(".add-project-name").value;
      if (this.projects.childElementCount < 4) {
        const newProject = { key: 3, name: newName, tasks: [] }
        this.addProject(newProject);
        this.addNew.classList.remove("d-none");
        this.form.classList.add("d-none");
      }
    });

    this.cancelFormBtn.addEventListener('click', () => {
      this.addNew.classList.remove("d-none");
      this.form.classList.add("d-none");
    })
  }




  addProject(project) {
    let tasks = new TasksList().addTasks(project);
    let projectName = project['name']
    let noOfTasks = project['tasks'].length
    projectName = projectName === '' ? 'Unnamed Project' : projectName
    let projectHtml = `
    <div class="project-${project["key"]} mb-4">
    <div class="project-name"><strong>(${projectName})</strong>
        <span class="noOfTasks">${noOfTasks}</span>
    </div>
    <div class="tasks-list">
        ${tasks}
        <button class="btn show-task-form">
        <span>
        <i class="fa-solid fa-plus fa-xl pe-1"></i>
        </span>
        Add task</button>
        <form class="w-100 d-flex flex-column task-form">                  
          <input type="text" placeholder="Name" >
          <input type="text" placeholder="Description" >

          <div className="control">
            <input type="date" placeholder="Date" >
            <div className="control-form">
            <button type="button" class="btn btn-light cancel-task">Cancel</button>
            <button class="btn btn-dark submit-task">Add task</button>
            </div>
          </div>

        </form>
    </div>
  </div>
  `
    this.projects.insertAdjacentHTML('beforeend', projectHtml);//a cookie for all the cross site script attackers
    this.addEventListeners(project)
  }

  addEventListeners(project) {
    const htmlItem = document.querySelector(".project-" + project.key)
    let showFormBtn = htmlItem.querySelector(".show-task-form")
    let form = htmlItem.querySelector('form')
    let cancelBtn = htmlItem.querySelector(".cancel-task")
    let addTaskBtn = htmlItem.querySelector('submit-task')

    showFormBtn.addEventListener('click', () => {
      form.style.visibility = "visible"
      showFormBtn.style.visibility = "hidden"
    }
    )
    cancelBtn.addEventListener('click', () => {
      form.style.visibility = "hidden"
      showFormBtn.style.visibility = 'visible'
    })
  }
  //alt for cancelBtns: Array.from(showFormBtns).map(btn => btn.nextElementSibling)

}