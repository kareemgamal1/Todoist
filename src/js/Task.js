export default class Task {
  addTask(taskName, taskDescription) {
    return `<div class="task">
    <button class="done"></button>
    <div class="task-name">${taskName}</div>
    <div className="task-description">${taskDescription}</div>
    <button class="actions">
      <i class="fa-solid fa-ellipsis"></i>
    </button>
    </div>`
  }
}