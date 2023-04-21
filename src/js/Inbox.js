import { InboxDOM } from "./InboxDOM";
import Project from "./Project";
import LocalStorage from "./localStorage";


export default class Inbox {
    //Keeps track of projects, 
    constructor() {
        this.inboxDOM = new InboxDOM(this) //singleton (yay design patterns)
        this.localStorage = new LocalStorage();
        this.initializeProjects()


        let addFormBtn = document.querySelector(".new-project .add");

        addFormBtn.addEventListener("click", () => {
            let newName = document.querySelector(".add-project-name").value;
            const newProject = new Project(this.nextProjectID++, newName)
            this.addProject(newProject)
        });
        this.inboxDOM.addEventListeners()
    }

    //pass them for the first time on dummy projects, then for each new project use eventlistener to initialize it seperately
    initializeProjects() {
        this.localStorage.initialize()
        this.projects = this.localStorage.getProjects()
        this.nextProjectID = this.localStorage.getNextProjectID()
        this.projects.forEach(project => {
            project.addProject()
        })
    }

    addProject(project) {
        this.localStorage.addProject(project)
        this.inboxDOM.addProject(project)
    }

    updateProject(projectID, projectName) {
        this.projects[projectID].name = projectName
        this.localStorage.setProjects(this.projects)
    }
}
new Inbox()
