export default class Project {
  constructor(key, name, ...tasks) {
    this.taskID = 1;
    this.ID = key;
    this.name = name;
    if (tasks) {
      this.tasks = tasks
      this.noOfTasks = tasks.length
    }
    else {
      this.tasks = []
      this.noOfTasks = 0
    }
  }
}