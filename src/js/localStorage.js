import Project from "./Project";
import ProjectDOM from "./ProjectDOM";
import Task from "./Task";
import TaskDOM from "./TaskDOM";

export default class LocalStorage {

    initialize() {
        this.nextProjectID = 0;

        let projects = [
            new Project(this.nextProjectID++, "", new Task(0, "I don't know honestly", "Yeahhh", new Date("3/1/2023"), 0), new Task(1, "I miss her", "idk", new Date(), 0)),
            new Project(this.nextProjectID++, "College", new Task(0, "Hey", "I need to study", new Date(), 1))
        ] //Application wide data

        localStorage.setItem('projects', JSON.stringify(projects))
        localStorage.setItem('finishedTasks', 0)
    }

    addProject(project) {
        let projects = JSON.parse(localStorage.getItem("projects") || "[]");
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects))
    }

    setProjects(projects) {
        //when Date is invalid it's stored as null because it cannot be serialized
        localStorage.setItem('projects', JSON.stringify(projects))
        projects = this.getProjects()
    }

    getProjects() {
        let projects = JSON.parse(localStorage.getItem("projects") || "[]");
        projects = projects.map((project) => {
            project.localStorage = new LocalStorage()
            project.projectDOM = new ProjectDOM(project)
            return Object.assign(new Project(), project)
        })
        projects.forEach((project) => {
            project.tasks = project.tasks.map((task) => {
                task.localStorage = new LocalStorage()
                task.taskDOM = new TaskDOM()
                return Object.assign(new Task(), task)
            })
        })
        return projects
    }

    getNextProjectID() {
        return this.nextProjectID
    }

    finishTask(projects) {
        this.setProjects(projects)
        let finishedTasks = localStorage.getItem('finishedTasks');
        finishedTasks++;
        localStorage.setItem('finishedTasks', finishedTasks)
    }
}