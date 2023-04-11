import { InboxDOM } from "./InboxDOM";
import Project from "./Project";
import Task from "./Task";


export default class Inbox {
    constructor() {
        let nextProjectID = 0;
        this.nextProjectID = nextProjectID
        this.projects = [
            new Project(this.nextProjectID++, "", new Task(0, "I don't know honestly", "Yeahhh", 0), new Task(1, "I miss her", "idk", 0)),
            new Project(this.nextProjectID++, "College", new Task(0, "Hey", "I need to study", 1))
        ] //Application wide data
        localStorage.setItem('finishedTasks', 0)

        this.inboxDOM = new InboxDOM() //singleton (yay design patterns)
        this.initializeProjects()

        localStorage.setItem('projects', JSON.stringify(this.projects))

        let addFormBtn = document.querySelector(".new-project .add");

        addFormBtn.addEventListener("click", () => {
            let newName = document.querySelector(".add-project-name").value;
            const newProject = new Project(this.nextProjectID++, newName)
            console.log(newProject)
            const projectsHtml = document.querySelector(".projects");
            if (projectsHtml.childElementCount < 4) {
                this.projects.push(newProject)//this duplicates array as initialize calls it
                localStorage.setItem('projects', JSON.stringify(this.projects))
                this.addProject(newProject)
            }
        });

    }

    //pass them for the first time on dummy projects, then for each new project use eventlistener to initialize it seperately
    initializeProjects() {
        this.projects.forEach(item => {
            this.addProject(item)
        })
    }

    addProject(project) {
        this.inboxDOM.addProject(project)
        project.addEventListeners()
    }
}
new Inbox()

//TODO make inbox contain inboxDOM only, make Project do ProjectDOM