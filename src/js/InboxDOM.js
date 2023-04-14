export class InboxDOM {
    constructor() {
        this.form = document.querySelector(".new-project");
        this.addProj = document.querySelector(".add-project-btn");
        this.cancelFormBtn = document.querySelector('.new-project .cancel-add')

        this.addProj.addEventListener("click", () => {
            this.addProj.classList.add("d-none");
            this.form.classList.remove("d-none");
        });


        this.cancelFormBtn.addEventListener('click', () => {
            this.addProj.classList.remove("d-none");
            this.form.classList.add("d-none");
        })
    }

    addProject(project) {
        let projectName = project['name']
        projectName = projectName === '' ? 'Unnamed Project' : projectName

        let projectHtml = `
    <div class="project-${project.ID} mb-4">
    <div class="project-name"><strong>(${projectName})</strong>
        <span class="noOfTasks">${project.noOfTasks}</span>
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
            <input type="date" class="taskDate" onclick="this.showPicker()" >
            <div className="control-form">
            <button type="button" class="btn btn-light cancel-task">Cancel</button>
            <button type="button" class="btn btn-dark submit-task">Add task</button>
            </div>
          </div>

        </form>
  </div>
  `

        this.addProj.classList.remove("d-none");
        this.form.classList.add("d-none");
        let projectsHtml = document.querySelector(".projects");
        projectsHtml.insertAdjacentHTML('beforeend', projectHtml);//a cookie for all the cross site script attackers
        project.addTasks()
        project.addEventListeners()

    }



    //alt for cancelBtns: Array.from(showFormBtns).map(btn => btn.nextElementSibling)
}

