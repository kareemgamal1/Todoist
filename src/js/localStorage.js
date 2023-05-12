// Import required modules and classes
import Project from "./Project";
import ProjectDOM from "./ProjectDOM";
import Task from "./Task";
import TaskDOM from "./TaskDOM";

// Define the LocalStorage class
export default class LocalStorage {

    // Initialize the local storage with default data
    initialize() {
        this.nextProjectID = 0;

        const projects = [
            new Project(
                this.nextProjectID++,
                "",
                new Task("I don't know honestly", "Yeahhh", new Date("6/1/2023"), 0),
                new Task("I miss her", "idk", new Date(), 0)
            ),
            new Project(
                this.nextProjectID++,
                "College",
                new Task("Hey", "I need to study", new Date(), 0)
            )
        ];

        localStorage.setItem('projects', JSON.stringify(projects));
        localStorage.setItem('today', JSON.stringify([]));
        localStorage.setItem('finishedTasks', 0);
    }

    // Add a new project to the local storage
    addProject(project) {
        const projects = JSON.parse(localStorage.getItem("projects") || "[]");
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    // Update an existing project in the local storage
    updateProject(projectID, projectName) {
        const projects = this.getProjects();
        projects[projectID].name = projectName;
        this.setProjects(projects);
    }

    // Save the projects array to the local storage
    setProjects(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    // Get the projects array from the local storage
    getProjects() {
        let projects = JSON.parse(localStorage.getItem("projects") || "[]");
        projects = projects.map((project) => {
            project.localStorage = new LocalStorage();
            project.projectDOM = new ProjectDOM(project);
            return Object.assign(new Project(), project);
        })
        projects.forEach((project) => {
            project.tasks = project.tasks.map((task) => {
                task.localStorage = new LocalStorage();
                task.taskDOM = new TaskDOM();
                return Object.assign(new Task(), task);
            })
        })
        return projects;
    }

    // Get the ID for the next project to be added
    getNextProjectID() {
        return this.nextProjectID;
    }

    // Increase the count of finished tasks in the local storage
    finishTask(projects) {
        this.setProjects(projects);
        let finishedTasks = localStorage.getItem('finishedTasks');
        finishedTasks++;
        localStorage.setItem('finishedTasks', finishedTasks);
    }

    setToday(today) {
        localStorage.setItem('today', JSON.stringify(today));
    }
    getToday() {
        let todayTasks = JSON.parse(localStorage.getItem("today") || "[]");
        todayTasks = todayTasks.map((task) => {
            task.localStorage = new LocalStorage();
            task.taskDOM = new TaskDOM();
            return Object.assign(new Task(), task);
        })
        return todayTasks;
    }
}