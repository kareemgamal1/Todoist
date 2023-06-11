/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
// Import required modules and classes
import Project from "./Project";
import ProjectDOM from "./DOM/ProjectDOM";
import Task from "./Task";
import TaskDOM from "./DOM/TaskDOM";
import Day from "./Day";
import DayDOM from "./DOM/DayDOM";

// Define the LocalStorage class
export default class LocalStorage {
    // Initialize the local storage with default data
    initialize() {
        // Projects
        this.projects = [
            new Project(
                "",
                new Task("Walk the dog", "", new Date(2023, 4, 1, 16, 30)),
                new Task("Attend my work anniversary party", "1-Get the suit ready\n2-Fuel the car", new Date(2023, 6, 1, 12, 5)),
                new Task("Clean the dishes for my wife", "Wash my hands", new Date())
            ),
            new Project(
                "College",
                new Task("Hey", "I need to study", new Date())
            )
        ];
        localStorage.setItem("projects", JSON.stringify(this.projects));

        const tasks = [];
        this.projects.forEach(project => {
            project.tasks.forEach(task => {
                task.projectID = project.ID;
                task.initialize();
                tasks.push(task);
            });
        });
        localStorage.setItem("projects", JSON.stringify(this.projects));
        // Today tasks
        const today = new Date();
        const todayTasks = tasks.filter((task) =>
            new Date(task.date).toDateString() === today.toDateString()
        );
        localStorage.setItem("todayTasks", JSON.stringify(todayTasks));
        // all tasks
        localStorage.setItem("tasks", JSON.stringify(tasks));

        localStorage.setItem("finishedTasks", 0);
    }

    // Add a new project to the local storage
    addProject(project) {
        const projects = JSON.parse(localStorage.getItem("projects") || "[]");
        projects.push(project);
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    // Update an existing project in the local storage
    updateProject(projectID, projectName) {
        const projects = this.getProjects();
        const projectIndex = projects.findIndex((project) => project.ID === projectID);
        projects[projectIndex].name = projectName;
        this.setProjects(projects);
    }

    // Save the projects array to the local storage
    setProjects(projects) {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    // Get the projects array from the local storage
    getProjects() {
        let projects = JSON.parse(localStorage.getItem("projects") || "[]");
        projects = projects.map((project) => {
            project.localStorage = new LocalStorage();
            project.projectDOM = new ProjectDOM(project);
            return Object.assign(new Project(), project);
        });

        projects.forEach((project) => {
            project.tasks = project.tasks.map((task) => {
                task.localStorage = new LocalStorage();
                task.taskDOM = new TaskDOM();
                task.date = new Date(task.date);
                return Object.assign(new Task(), task);
            });
        });
        return projects;
    }

    getProjectID(projectTask) {
        // Get all the projects
        const projects = this.getProjects();

        // Find the project that has a task with the given projectTask.ID
        const matchingProject = projects.find(project =>
            // Check if any task in the project matches the condition
            project.tasks.some(task => task.ID === projectTask.ID)
        );

        // If a matching project is found, return its ID property. Otherwise, return -1.
        const projectID = matchingProject?.ID ?? -1;
        return projectID;
    }

    getProjectTasks(projectID) {
        const projects = this.getProjects();
        const tasks = [];
        projects.forEach(project => {
            if (project.ID === projectID)
                project.tasks.forEach(task => {
                    tasks.push(task);
                });
        });
        return tasks;
    }


    setTodayTasks(todayTasks) {
        localStorage.setItem("todayTasks", JSON.stringify(todayTasks));
    }

    getTodayTasks() {
        let todayTasks = JSON.parse(localStorage.getItem("todayTasks") || "[]");
        todayTasks = todayTasks.map((task) => {
            task.localStorage = new LocalStorage();
            task.taskDOM = new TaskDOM();
            task.date = new Date(task.date);
            return Object.assign(new Task(), task);
        });
        return todayTasks;
    }

    getProjectsTasks() {
        const projects = this.getProjects();
        const tasks = [];
        projects.forEach(project => {
            project.tasks.forEach(task => {
                tasks.push(task);
            });
        });
        return tasks;
    }


    getTasks() {
        // const projectTasks = this.getProjectsTasks(); // Get an array of project tasks
        // const todayTasks = this.getTodayTasks(); // Get an array of tasks for today
        // const totalTasks = projectTasks.concat(todayTasks); // Concatenate the two arrays into a single array of all tasks
        // const uniqueTasks = totalTasks.filter((elem, index, self) => {
        //     // Apply the filter method on the concatenated array to remove duplicates
        //     return index === self.findIndex(t => t.ID === elem.ID); // Keep only the first occurrence of each task with a unique ID
        // });
        let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        tasks = tasks.map((task) => {
            task.localStorage = new LocalStorage();
            task.taskDOM = new TaskDOM();
            task.date = new Date(task.date);
            return Object.assign(new Task(), task);
        });
        return tasks;
    }

    setTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    getTask(taskID) {
        const tasks = this.getTasks();
        const tasksIndex = tasks.findIndex((t) => t.ID === taskID);
        return tasks[tasksIndex];
    }

    setTask(taskID, newTask) {
        const tasks = this.getTasks();
        const tasksIndex = tasks.findIndex((t) => t.ID === taskID);
        tasks[tasksIndex] = newTask;
        this.setTasks(tasks);
    }

    addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        this.setTasks(tasks);
    }

    setDays(days) {
        localStorage.setItem("days", JSON.stringify(days));
    }

    getDays() {
        // Retrieve the days array from local storage, or an empty array if it doesn't exist
        const days = JSON.parse(localStorage.getItem("days") || "[]");

        // Loop through each day object and update its properties
        days.forEach((day) => {
            // Create a new local storage instance for the day
            day.localStorage = new LocalStorage();
            // Create a new day DOM instance for the day
            day.dayDOM = new DayDOM(day.tasks, day.date, day.dateString);
            // Loop through each task object for the day and update its properties
            day.tasks.forEach((task) => {
                // Create a new local storage instance for the task
                task.localStorage = new LocalStorage();
                // Create a new task DOM instance for the task
                task.taskDOM = new TaskDOM();
                // Convert the task date string to a date object
                task.date = new Date(task.date);
            });
        });

        // Map the updated day objects to a new array of Day instances
        return days.map((day) => new Day(new Date(day.date), day.tasks, day.localStorage, day.dayDOM));
    }

    getDayTasks(date) {
        const allTasks = this.getTasks();
        const dayTasks = [];
        date = new Date(date);
        allTasks.forEach(task => {
            const taskDate = new Date(task.date);
            const isToday = taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear();
            if (isToday) {
                dayTasks.push(task);
            }
        });
        return dayTasks;
    }

    setTasksForDay(date, newTasks) {
        const dayDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        const days = this.getDays();
        const dayIndex = days.findIndex((element) => element.dateString === dayDate);

        if (dayIndex === -1) {
            return;
        }

        days[dayIndex].tasks = newTasks;
        this.setDays(days);
    }

    finishTask(task) {
        // Projects
        {
            const projectID = this.getProjectID(task);
            const projects = this.getProjects();
            const project = projects.find((p) => p.ID === projectID);
            if (project) {
                project.tasks = project.tasks.filter((projectTask) => projectTask.ID !== task.ID);
                project.noOfTasks = project.tasks.length;
            }
            this.setProjects(projects);
        }
        // Today
        {
            const todayTasks = this.getTodayTasks().filter((todayTask) => todayTask.ID !== task.ID);
            this.setTodayTasks(todayTasks);
        }
        // Day
        {
            const dayTasks = this.getDayTasks(task.date).filter((t) => t.ID !== task.ID);
            this.setTasksForDay(task.date, dayTasks);
        }
        // Tasks
        {
            const tasks = this.getTasks().filter((t) => t.ID !== task.ID);
            this.setTasks(tasks);
        }
        // DOM
        localStorage.setItem("finishedTasks", Number(localStorage.getItem("finishedTasks")) + 1);
    }
}