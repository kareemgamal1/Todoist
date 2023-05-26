import Day from "./Day";
import UpcomingDOM from "./DOM/UpcomingDOM"
import LocalStorage from "./localStorage"

export default class Upcoming {
    constructor() {
        this.upcomingDOM = new UpcomingDOM()
        this.localStorage = new LocalStorage()
    }

    initialize() {
        const startDate = new Date(); // Get today's date
        const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()); // Get next year's date

        const daysArray = [];

        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            daysArray.push(new Day(new Date(date)));
        }
        this.localStorage.setDays(daysArray)
        this.upcomingDOM.initialize()
    }
}