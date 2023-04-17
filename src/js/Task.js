import TaskDOM from "./TaskDOM";
import LocalStorage from "./localStorage";

export default class Task {
  constructor(ID, name, description, date, projectID) {
    this.ID = ID
    this.name = name;
    this.description = description
    if (date)
      this.date = date

    this.projectID = projectID //optional

    this.localStorage = new LocalStorage();
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
    let projects = this.localStorage.getProjects()

    const projectIndex = projects.findIndex((p) => p.ID == projectID)
    let project = projects[projectIndex]
    project['tasks'] = project['tasks'].filter((task) =>
      task.ID != this.ID
    )
    project['noOfTasks'] = project['tasks'].length;
    projects[projectIndex] = project

    this.localStorage.finishTask(projects)
    this.taskDOM.finishTask(project, this.ID)
  }

}