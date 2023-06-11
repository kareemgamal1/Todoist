# [Todoist](https://todoist.com/_next/static/images/video-preview-features@2x_583931dc1e609b5643d0dd3a9eeea58d.jpg)
## Seventh project from [The Odin Project]([https://www.theodinproject.com/lessons/node-path-javascript-restaurant-page](https://www.theodinproject.com/lessons/node-path-javascript-todo-list)) curriculum.

---

You can try it out [here](https://kareemgamal1.github.io/Todoist/)

---
Welcome to my task management website! I designed this website entirely with vanilla JavaScript and bundled it together with webpack, without using any libraries or frameworks, to gain a deeper understanding of how everything works, I started it a year or so ago and went on to learn and build different stuff with different frameworks but decided to come back and finish it!

The website offers a default template of tasks divided into three main sections: Inbox, Today, and Upcoming. You can create new projects in the inbox page and add tasks by selecting where you want to add them. Task creation flows unidirectionally from Inbox to Today & Upcoming, but you can easily add tasks to a specific project and it will be updated in the other pages.

---
## Functionalities:
All locations:<br />
 -Tasks localStorage <br />
 -Projects localStorage <br />
 -TodayTasks localStorage <br />
 -Days and their tasks localStorage<br />
 -Number of finished tasks localStorage<br />
 -Inbox projects, upcoming days, and today. <br />

1-Add task from anywhere (Project, Today, Day) affects all locations

2-Edit name,description of a task from anywhere (Project, Today, Day) affects all locations

3-Edit task date changes the location of the date accordingly, if it's in Today page and i change it to tomorrow, it's moved there, same with days, for a task in a project the date itself will only change will still being kept in the same project

4-Finish task from anywhere (Project, Today, Day) affects all locations

5-Finish task increments total tasks only once in the header and in local storage

6-Delete task without finishing it

7-Delete project while keeping its tasks, just removing the project location and ID of the task (Doesn't affect client side)

8-Days in the upcoming page are lazy loaded to improve performance, scroll down to load 5 days each time.

9-Old dates are colored red

---
## Future features to add:
1-Ability to sign up, and save user info to firebase <br />

2-Ability to add a task with a selected or new project from pages other than Inbox page <br />

3-Drag and drop tasks between projects, days. <br />

4-Add description to a task without description. <br />

5-In the header, + makes you add a new task. <br />

6-Search for a task from search bar, add a new page for resultant tasks <br />

7-Add Overdue section in Upcoming&Today Pages to feature tasks before today



