import InboxDOM from "./DOM/InboxDOM";
import Project from "./Project";
import LocalStorage from "./localStorage";


export default class Inbox {
    constructor() {
        this.inboxDOM = new InboxDOM()
        this.localStorage = new LocalStorage();

        const addFormBtn = document.querySelector(".new-project .add");
        addFormBtn.addEventListener("click", () => {
            const newName = document.querySelector(".add-project-name").value;
            const newProject = new Project(newName)
            newProject.addProject()
        });
    }

    initialize() {
        this.projects = this.localStorage.getProjects()
        this.projects.forEach(project => {
            project.addProjectToDOM()
        })
    }
}
