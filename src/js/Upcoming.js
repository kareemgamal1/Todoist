import Day from "./Day";
import UpcomingDOM from "./DOM/UpcomingDOM"
import LocalStorage from "./localStorage"

export default class Upcoming {
    constructor() {
        this.upcomingDOM = new UpcomingDOM(); // Instantiate UpcomingDOM class
        this.localStorage = new LocalStorage(); // Instantiate LocalStorage class
    }

    initialize() {
        const startDate = new Date(); // Get today's date
        const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()); // Get next year's date

        const daysArray = []; // Create an empty array to store Day objects

        // Loop through each day from startDate to endDate, creating a new Day object for each day and pushing it to the daysArray
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            daysArray.push(new Day(new Date(date)));
        }

        this.localStorage.setDays(daysArray); // Save the daysArray to local storage using the setDays method of the LocalStorage class
        this.upcomingDOM.initialize(); // Initialize the UpcomingDOM class to display the daysArray
    }
}