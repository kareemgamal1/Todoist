import { InboxDOM } from "./InboxDOM";
export default class Inbox {
    constructor() {
        //data
        let currentID = 1;
        this.projects = [
            {
                key: currentID++,
                name: "",
                tasks: [
                    { name: "I don't know honestly", description: "Yeahhh" }
                    , { name: "I miss her", description: "idkidkidk" }]
            },
            {
                key: currentID++,
                name: "College",
                tasks:
                    [{ name: "Hey", description: "I need to study" }]
            }
        ]

        this.inbox = new InboxDOM() //singleton (yay design patterns)
        this.initializeProjects()

        this.addFormBtn = document.querySelector(".new-project .add");
        this.projectsHtml = document.querySelector(".projects");


        this.addFormBtn.addEventListener("click", () => {
            let newName = document.querySelector(".add-project-name").value;
            if (this.projectsHtml.childElementCount < 4) {
                const newProject = { key: currentID++, name: newName, tasks: [] }
                this.inbox.addProject(newProject);
                this.inbox.newProjectEvents()
            }
        });

    }

    //pass them for the first time on dummy projects, then for each new project use another function to initialize it seperately
    initializeProjects() {
        //appending to DOM
        this.projects.forEach(item => {
            this.inbox.addProject(item)
        })
    }
}
new Inbox()