export default class Project {
  constructor(key, name, ...tasks) {
    this.ID = key;
    this.name = name;
    this.tasks = tasks
    this.noOfTasks = tasks.length
  }


}