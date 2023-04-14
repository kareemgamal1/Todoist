import { InboxDOM } from "./InboxDOM";
import Project from "./Project";
import Task from "./Task";


export default class Inbox {
    //Keeps track of projects, 
    constructor() {
        this.nextProjectID = 0
        this.projects = [
            new Project(this.nextProjectID++, "", new Task(0, "I don't know honestly", "Yeahhh", new Date(), 0), new Task(1, "I miss her", "idk", new Date(), 0)),
            new Project(this.nextProjectID++, "College", new Task(0, "Hey", "I need to study", new Date(), 1))
        ] //Application wide data

        localStorage.setItem('projects', JSON.stringify(this.projects))
        localStorage.setItem('finishedTasks', 0)

        this.inboxDOM = new InboxDOM() //singleton (yay design patterns)
        this.initializeProjects()


        let addFormBtn = document.querySelector(".new-project .add");

        addFormBtn.addEventListener("click", () => {
            let newName = document.querySelector(".add-project-name").value;
            const newProject = new Project(this.nextProjectID++, newName)
            this.projects.push(newProject)
            this.addProject(newProject)
        });

    }

    //pass them for the first time on dummy projects, then for each new project use eventlistener to initialize it seperately
    initializeProjects() {
        this.projects.forEach(item => {
            this.addProject(item)
        })
    }

    addProject(project) {
        localStorage.setItem('projects', JSON.stringify(this.projects))
        this.inboxDOM.addProject(project)
    }
}
new Inbox()

//TODO make inbox contain inboxDOM only, make Project do ProjectDOM