import { InboxDOM } from "./InboxDOM";
import Project from "./Project";
import Task from "./Task";
export default class Inbox {
    constructor() {
        //data
        let currentID = 1;
        //TODO : Turn each project into an object, each project tasks into array of Task object
        this.projects = [
            new Project(currentID++, "", new Task(1, "I don't know honestly", "Yeahhh"), new Task(2, "I miss her", "idk")),
            ,
            new Project(currentID++, "College", new Task(1, "Hey", "I need to study"))
        ]

        this.inboxDOM = new InboxDOM() //singleton (yay design patterns)
        this.initializeProjects()

        this.addFormBtn = document.querySelector(".new-project .add");
        this.projectsHtml = document.querySelector(".projects");

        this.addFormBtn.addEventListener("click", () => {
            let newName = document.querySelector(".add-project-name").value;
            if (this.projectsHtml.childElementCount < 4) {
                const newProject = new Project(currentID++, newName)
                this.inboxDOM.addProject(newProject);
                this.inboxDOM.newProjectEvents()
            }
        });

    }

    //pass them for the first time on dummy projects, then for each new project use another function to initialize it seperately
    initializeProjects() {
        //appending to DOM
        this.projects.forEach(item => {
            //TODO add new projects to this.projects
            this.inboxDOM.addProject(item)
        })
    }
}
new Inbox()