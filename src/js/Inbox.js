import { InboxDOM } from "./InboxDOM";
import Project from "./Project";
import LocalStorage from "./localStorage";
import Today from "./Today";


export default class Inbox {
    //Keeps track of projects, 
    constructor() {
        this.inboxDOM = new InboxDOM(this) //singleton (yay design patterns)
        this.localStorage = new LocalStorage();
        this.initializeProjects()
        let today = new Today()
        today.initialize()
        let addFormBtn = document.querySelector(".new-project .add");

        addFormBtn.addEventListener("click", () => {
            let newName = document.querySelector(".add-project-name").value;
            const newProject = new Project(this.nextProjectID++, newName)
            newProject.addProject()
        });
    }

    initializeProjects() {
        this.localStorage.initialize()
        this.projects = this.localStorage.getProjects()
        this.nextProjectID = this.localStorage.getNextProjectID()
        this.projects.forEach(project => {
            project.addProjectToDOM()
        })
    }
}
new Inbox()
