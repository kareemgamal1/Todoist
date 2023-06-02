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
        //Projects
        this.projects = [
            new Project(
                "",
                new Task("I don't know honestly", "Yeahhh", new Date("6/1/2023")),
                new Task("I miss her", "idk", new Date())
            ),
            new Project(
                "College",
                new Task("Hey", "I need to study", new Date())
            )
        ];
        localStorage.setItem('projects', JSON.stringify(this.projects));

        let tasks = []
        this.projects.forEach(project => {
            project.tasks.forEach(task => {
                task.projectID = project.ID
                task.initialize()
                tasks.push(task)
            })
        })
        localStorage.setItem('projects', JSON.stringify(this.projects));
        //Today tasks
        let today = new Date()
        let todayTasks = tasks.filter((task) =>
            new Date(task.date).toDateString() === today.toDateString()
        )
        localStorage.setItem('todayTasks', JSON.stringify(todayTasks));
        //all tasks
        localStorage.setItem('tasks', JSON.stringify(tasks))

        localStorage.setItem('finishedTasks', 0);
    }

    // Add a new project to the local storage
    addProject(project) {
        let projects = JSON.parse(localStorage.getItem("projects") || "[]");
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    // Update an existing project in the local storage
    updateProject(projectID, projectName) {
        let projects = this.getProjects();
        const projectIndex = projects.findIndex((project) => project.ID === projectID);
        projects[projectIndex].name = projectName;
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
                task.date = new Date(task.date)
                return Object.assign(new Task(), task);
            })
        })
        return projects;
    }

    getProjectID(projectTask) {
        let projectID = -1
        let projects = this.getProjects()
        for (const project of projects) {
            for (const task of project.tasks) {
                if (task.ID === projectTask.ID) {
                    projectID = project.ID;
                    break;
                }
            }
        }
        return projectID
    }

    getProjectTasks(projectID) {
        let projects = this.getProjects()
        let tasks = []
        projects.forEach(project => {
            if (project.ID === projectID)
                project.tasks.forEach(task => {
                    tasks.push(task)
                })
        })
        return tasks
    }


    setTodayTasks(todayTasks) {
        localStorage.setItem('todayTasks', JSON.stringify(todayTasks));
    }

    getTodayTasks() {
        let todayTasks = JSON.parse(localStorage.getItem("todayTasks") || "[]");
        todayTasks = todayTasks.map((task) => {
            task.localStorage = new LocalStorage();
            task.taskDOM = new TaskDOM();
            task.date = new Date(task.date)
            return Object.assign(new Task(), task);
        })
        return todayTasks;
    }

    getProjectsTasks() {
        let projects = this.getProjects()
        let tasks = []
        projects.forEach(project => {
            project.tasks.forEach(task => {
                tasks.push(task)
            })
        })
        return tasks
    }


    getTasks() {
        // const projectTasks = this.getProjectsTasks(); // Get an array of project tasks
        // const todayTasks = this.getTodayTasks(); // Get an array of tasks for today
        // const totalTasks = projectTasks.concat(todayTasks); // Concatenate the two arrays into a single array of all tasks
        // const uniqueTasks = totalTasks.filter((elem, index, self) => {
        //     // Apply the filter method on the concatenated array to remove duplicates
        //     return index === self.findIndex(t => t.ID === elem.ID); // Keep only the first occurrence of each task with a unique ID
        // });
        let tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
        tasks = tasks.map((task) => {
            task.localStorage = new LocalStorage();
            task.taskDOM = new TaskDOM();
            task.date = new Date(task.date)
            return Object.assign(new Task(), task);
        })
        return tasks
    }

    setTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }



    setDays(days) {
        localStorage.setItem('days', JSON.stringify(days));
    }

    getDays() {
        let days = JSON.parse(localStorage.getItem("days") || "[]");
        days = days.map((day) => {
            day.localStorage = new LocalStorage();
            day.dayDOM = new DayDOM(day.tasks, day.date, day.dateString);
            return Object.assign(new Day(new Date(day.date)), day);
        })

        days.forEach((day) => {
            day.tasks = day.tasks.map((task) => {
                task.localStorage = new LocalStorage();
                task.taskDOM = new TaskDOM();
                task.date = new Date(task.date)
                return Object.assign(new Task(), task);
            })
        })
        return days;
    }

    getTasksForDay(date) {
        let allTasks = this.getTasks()
        let dayTasks = []
        date = new Date(date)
        allTasks.forEach(task => {
            const taskDate = new Date(task.date)
            const isToday = taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
            if (isToday) {
                dayTasks.push(task)
            }
        })
        return dayTasks
    }

    setTasksForDay(date, newTasks) {
        let days = this.getDays()
        let dayDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
        let dayIndex = -1;
        let dayToEdit;
        for (let index = 0; index < days.length; index++) {
            const element = days[index];
            if (element.dateString === dayDate) {
                dayIndex = index
                dayToEdit = element
                break;
            }
        }
        days[dayIndex].tasks = newTasks
        this.setDays(days)
    }

    // Increase the count of finished tasks in the local storage
    finishTask(task) {
        //Projects
        {
            let projectID = this.getProjectID(task)
            let projects = this.getProjects()
            const projectIndex = projects.findIndex((p) => p.ID == projectID)
            let project = projects[projectIndex]
            if (projectID !== -1) {
                project['tasks'] = project['tasks'].filter((projectTask) =>
                    projectTask.ID != task.ID
                )
                projects[projectIndex] = project
                project['noOfTasks'] = project['tasks'].length;
            }
            this.setProjects(projects);
        }
        //Today
        {
            let todayTasks = this.getTodayTasks()
            const taskIndex = todayTasks.findIndex((todayTask) => todayTask.ID == task.ID)
            todayTasks = todayTasks.filter((todayTask) =>
                todayTask.ID != task.ID
            )
            if (taskIndex !== -1) {
                this.setTodayTasks(todayTasks)
            }
        }
        //Day
        {
            let dayTasks = this.getTasksForDay(task.date)
            dayTasks = dayTasks.filter((t) =>
                t.ID != task.ID
            )
            this.setTasksForDay(task.date, dayTasks)
        }
        //Tasks
        {
            let tasks = this.getTasks()
            tasks = tasks.filter((t) =>
                t.ID != task.ID
            )
            this.setTasks(tasks)
        }
        //DOM
        {
            let finishedTasks = localStorage.getItem('finishedTasks');
            finishedTasks++;
            localStorage.setItem('finishedTasks', finishedTasks);
        }
    }
}