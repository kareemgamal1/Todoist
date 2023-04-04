import Task from "./Task"
export default class TasksList {
    addTasks(project) {
        console.log(project);
        let tasks = ``
        if (project['tasks'].length === 0)
            return tasks
        project['tasks'].forEach(task => {
            const currentTask = new Task()
            tasks += currentTask.addTask(task['name'])
        })
        return tasks
    }
}