import TaskDOM from "./TaskDOM";

export default class DayDOM {
  constructor(tasks, date, dateString) {
    this.tasks = tasks
    this.date = new Date(date)
    this.dateString = dateString
  }

  initialize() {
    this.tasks.forEach(task => {
      const taskLocation = `day-${this.dateString}`
      const htmlItem = document.querySelector(`.${taskLocation}`)
      let taskDOM = new TaskDOM();
      let newTask = taskDOM.addTask(task, taskLocation)
      let tasks = htmlItem.querySelector('.tasks-list')
      tasks.innerHTML += newTask
    });
  }

  addEventListeners() {
    const htmlItem = document.querySelector(".day-" + this.dateString)
    let showFormBtn = htmlItem.querySelector(".show-task-form")
    let form = htmlItem.querySelector('form')
    let cancelBtn = htmlItem.querySelector(".cancel-task")
    let addTaskBtn = htmlItem.querySelector('.submit-task')

    showFormBtn.addEventListener('click', () => {
      form.style.visibility = "visible"
      showFormBtn.style.visibility = "hidden"

      let taskName = htmlItem.querySelector('.taskName')
      let taskDescription = htmlItem.querySelector('.taskDescription')
      let taskDate = htmlItem.querySelector('.taskDate')

      taskName.style.border = "none"
      taskName.value = ""
      taskDescription.value = ""

      const now = new Date();
      const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
      const isoDate = localDate.toISOString().slice(0, 16);
      taskDate.value = isoDate
    }
    )

    cancelBtn.addEventListener('click', () => {
      form.style.visibility = "hidden"
      showFormBtn.style.visibility = 'visible'
    })

    addTaskBtn.addEventListener('click', () => {
      let taskName = htmlItem.querySelector('.taskName')
      if (taskName.value.length === 0) {
        taskName.style.border = "1px dotted red";
        return;
      }

      form.style.visibility = "hidden"
      showFormBtn.style.visibility = 'visible'
    })

  }

  addDay(day) {
    const options = { day: 'numeric', month: 'long', weekday: 'long' };
    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(this.date);
    let [weekdayText, monthText, dayText] = formattedDate.split(' ');
    formattedDate = `${dayText} ${monthText} ‧ ${weekdayText.slice(0, -1)}`//slice removes trailing comma from weekday

    //Check if date is today or tomorrow
    const today = new Date()
    const isToday = this.date.getDate() === today.getDate() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear()

    const isTomorrow = this.date.getDate() === today.getDate() + 1 &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear()

    if (isToday) {
      formattedDate = `<strong>Today</strong>, ${formattedDate}`;
    }
    else if (isTomorrow) {
      formattedDate = `<strong>Tomorrow</strong>, ${formattedDate}`;
    }


    let dayHTML =
      `
                        <div class="heading d-flex gap-1 align-items-center">
                    <small>${formattedDate}</small>
                    </div>
                    <hr class="day-seperator m-0 mb-1"></hr>
        <div class="day-${this.dateString}">
    <div class="tasks-list">

    </div>
    <button class="btn show-task-form">
        <span>
        <i class="fa-solid fa-plus fa-xl pe-1"></i>
        </span>
        Add task</button>
        <form class="w-100 d-flex flex-column task-form">                  
          <input type="text" placeholder="Name" class="taskName">
          <input type="text" placeholder="Description" class="taskDescription">

          <div className="control">
            <input type="datetime-local" class="taskDate" onclick="this.showPicker()" >
            <div className="control-form">
            <button type="button" class="btn btn-light cancel-task">Cancel</button>
            <button type="button" class="btn btn-dark submit-task">Add task</button>
            </div>
          </div>

        </form>
  </div>
        </div>
    
  `

    let daysHTML = document.querySelector(".upcoming-page");

    daysHTML.insertAdjacentHTML('beforeend', dayHTML);//a cookie for all the cross site script attackers

    day.addEventListeners()
    return dayHTML
  }

  addTask() {

  }

  updateTasks(day) {
    let dayHTML = document.querySelector(`.day-${day.dateString}`);
    let tasksList = dayHTML.querySelector('.tasks-list')
    let tasksHTML = ``

    day.tasks.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })

    day.tasks.forEach(task => {
      const location = `day-${day.dateString}`
      let newTask = new TaskDOM();
      tasksHTML +=
        newTask.addTask(task, location)
    })
    tasksList.innerHTML = tasksHTML
  }
}