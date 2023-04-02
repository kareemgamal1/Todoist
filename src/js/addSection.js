let addNew = document.querySelector(".add-sections");
let form = document.querySelector(".new-section");
let addFormBtn = document.querySelector(".new-section .add");
let cancelFormBtn = document.querySelector('.new-section .cancel-add')
let sections = document.querySelector(".sections");

export default class Projects {
  constructor() {
    addNew.addEventListener("click", () => {
      addNew.classList.add("d-none");
      form.classList.remove("d-none");
    });

    addFormBtn.addEventListener("click", () => {
      let newName = document.querySelector(".add-section-name").value;
      if (sections.childElementCount < 4) {
        this.addSection(newName);
        addNew.classList.remove("d-none");
        form.classList.add("d-none");
      }
    });

    cancelFormBtn.addEventListener('click', () => {
      addNew.classList.remove("d-none");
      form.classList.add("d-none");
    })
  }

  addTasks(project) {
    let newTask = ``
    for (const key in project) {
      if (Object.hasOwnProperty.call(project, key)) {
        const arr = project[key];
        arr.forEach(object => {
          newTask += `<div class="task">
      <button class="done"></button>
      <div class="task-name">${object["name"]}</div>
      <button class="actions">
        <i class="fa-solid fa-ellipsis"></i>
      </button>
    </div>`
        });
      }
    }

    return newTask
  }

  showForm(project) {

    // var form = this.closest('form');
    // if (task.style.display === "none") {
    //   task.style.display = "block";
    // } else {
    //   task.style.display = "none";
    // }
  }

  addSection(project) {
    let sectionName = Object.keys(project)[0]
    let noOfTasks = project[sectionName].length
    sectionName = sectionName === '' ? 'Unnamed Section' : sectionName
    let newSection = `
    <div class="section mb-4">
    <div class="section-name"><strong>(${sectionName})</strong>
        <span class="noOfTasks">${noOfTasks}</span>
    </div>
    <div class="tasks-list">
        ${this.addTasks(project)}
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
    sections.insertAdjacentHTML('beforeend', newSection);
    //a cookie for all the cross site script attackers
  }


}