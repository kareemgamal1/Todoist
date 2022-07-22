let addNew = document.querySelector(".add-sections");
let form = document.querySelector(".new-section");
let addSectionBtn = document.querySelector(".new-section .add");
let sectionName = document.querySelector(".add-section-name");
let sections = document.querySelector(".sections");

addNew.addEventListener("click", () => {
  addNew.classList.add("d-none");
  form.classList.remove("d-none");
});

addSectionBtn.addEventListener("click", () => {
  let newName = document.querySelector(".add-section-name").value;
  if (sections.childElementCount < 4) {
    addSection(newName);
  }
});

function addSection(sectionName) {
  let main = document.createElement("div");
  let name = document.createElement("div");
  name.className = "section-name";
  let noOfTasks = document.createElement("span");
  noOfTasks.className = "noOfTasks";
  let tasks = document.createElement("div");
  name.innerText = `(${sectionName}) `;
  name.appendChild(noOfTasks);
  main.appendChild(name);
  main.appendChild(tasks);
  sections.appendChild(main);
}
