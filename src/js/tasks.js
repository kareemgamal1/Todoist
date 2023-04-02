import "./addSection"
import Projects from "./addSection"
export default class Inbox {
    initializeProjects() {
        //data
        const projects = [
            {
                "": [
                    { name: "I don't know honestly" }
                    , { name: "I miss her" }]
            },
            { "College": [{ name: "Hey" }] }
        ]

        //appending to DOM
        const projectsPage = new Projects()
        projects.forEach(item => projectsPage.addSection(item))

        //event listeners
        let showFormBtns = document.querySelectorAll(".show-task-form")
        let cancelBtns = document.querySelectorAll(".cancel-task")
        let addTaskBtns = document.querySelectorAll('submit-task')
        //Array.from(showFormBtns).map(btn => btn.nextElementSibling)
        showFormBtns.forEach(btn => btn.addEventListener('click', () => {
            let form = btn.nextElementSibling.style.visibility
            if (form == "visible") {
                btn.nextElementSibling.style.visibility = "hidden"
            }
            else {
                showFormBtns.forEach(btn => { btn.style.visibility = 'hidden' })
                btn.nextElementSibling.style.visibility = "visible"
            }
        }))

        cancelBtns.forEach(btn => btn.addEventListener('click', () => {
            showFormBtns.forEach(btn => { btn.style.visibility = 'visible' })
            btn.closest('form').style.visibility = "hidden"
        }))


    }
}
const inbox = new Inbox()
inbox.initializeProjects()