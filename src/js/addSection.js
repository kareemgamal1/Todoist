let addNew = document.querySelector(".add-sections");
let form = document.querySelector(".new-section");
let addFormBtn = document.querySelector(".new-section .add");
let cancelFormBtn = document.querySelector('.new-section .cancel-add')
let sectionName = document.querySelector(".add-section-name");
let sections = document.querySelector(".sections");


function addSection(sectionName) {
  sectionName = sectionName === '' ? 'Unnamed Section' : sectionName
  console.log(sectionName)
  let newSection = `
  <div class="section ">
        <div class="section-name">(${sectionName})
        <span class="noOfTasks">0</span>
        </div>
        <div class="tasks-list">
            <div class="task">
              <button class="done"></button>
              <div class="task-name">xxx</div>
              <button class="actions">
                  <i class="fa-solid fa-ellipsis"></i>
              </button>
            </div>
        </div>
  </div>
  `
  sections.insertAdjacentHTML('beforeend', newSection);
  //a cookie for all the cross site script attackers
}

addNew.addEventListener("click", () => {
  addNew.classList.add("d-none");
  form.classList.remove("d-none");
});

addFormBtn.addEventListener("click", () => {
  let newName = document.querySelector(".add-section-name").value;
  if (sections.childElementCount < 4) {
    addSection(newName);
    addNew.classList.remove("d-none");
    form.classList.add("d-none");
  }
});

cancelFormBtn.addEventListener('click', () => {
  addNew.classList.remove("d-none");
  form.classList.add("d-none");
})