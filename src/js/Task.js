import TaskDOM from "./TaskDOM";

export default class Task {
  constructor(ID, name, description, projectID) {
    this.ID = ID
    this.projectID = projectID
    this.name = name;
    this.description = description
    this.taskDOM = new TaskDOM()
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

    this.taskDOM.finishTask(project, this.ID)
    //TODO Finish task adds up to the counter at the top, removes task from all across the app.
  }

}