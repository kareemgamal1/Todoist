import TaskDOM from "./TaskDOM";

export default class Task {
  constructor(ID, name, description, date, projectID) {
    this.ID = ID
    this.name = name;
    this.description = description
    this.date = date
    console.log(this.date)
    this.projectID = projectID //optional
    this.taskDOM = new TaskDOM()//necessary for the conversion from JSON to Object
  }

  addEventListeners() {
    const htmlItem = document.querySelector(`.project-${this.projectID}-task-${this.ID}`)
    let finishtask = htmlItem.querySelector('.done')

    finishtask.addEventListener('click', () => {
      this.finishTask(this.projectID, this.ID)
    })
  }

  finishTask(projectID) {
    let projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const projectIndex = projects.findIndex((p) => p.ID == projectID)
    let project = projects[projectIndex]
    project['tasks'] = project['tasks'].filter((task) =>
      task.ID != this.ID
    )
    project['noOfTasks'] = project['tasks'].length;
    projects[projectIndex] = project
    localStorage.setItem('projects', JSON.stringify(projects))
    let finishedTasks = localStorage.getItem('finishedTasks');
    finishedTasks++;
    localStorage.setItem('finishedTasks', finishedTasks)

    this.taskDOM.finishTask(project, this.ID)
  }

}