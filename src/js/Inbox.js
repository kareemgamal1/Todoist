import Project from "./Project"
export default class Inbox {
    constructor() {
        //data
        this.projects = [
            {
                key: 0,
                name: "",
                tasks: [
                    { name: "I don't know honestly" }
                    , { name: "I miss her" }]
            },
            {
                key: 1,
                name: "College",
                tasks:
                    [{ name: "Hey" }]
            }
        ]
        this.projectsPage = new Project()
        this.initializeProjects()
    }

    //pass them for the first time on dummy projects, then for each new project use another function to initialize it seperately
    initializeProjects() {
        //appending to DOM
        this.projects.forEach(item => {
            this.projectsPage.addProject(item)
        })
    }
}
new Inbox()