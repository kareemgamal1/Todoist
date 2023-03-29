import "./addSection"
import Projects from "./addSection"
export default class Inbox {
    initializeProjects() {
        const projectsPage = new Projects()
        const projects = [
            {
                "": [
                    { name: "I don't know honestly" }
                    , { name: "I miss her" }]
            },

            { "College": [{ name: "Hey" }] }
        ]
        projects.forEach(item => projectsPage.addSection(item))
    }
}
const inbox = new Inbox()
inbox.initializeProjects()