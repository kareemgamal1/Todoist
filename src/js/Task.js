export default class Task {
    addTask(taskName) {
        return `<div class="task">
      <button class="done"></button>
      <div class="task-name">${taskName}</div>
      <button class="actions">
        <i class="fa-solid fa-ellipsis"></i>
      </button>
    </div>`
    }
}