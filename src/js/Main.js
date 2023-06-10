import DOM from "./DOM/DOM";
import Inbox from "./Inbox";
import Today from "./Today";
import Upcoming from "./Upcoming";
import LocalStorage from "./localStorage";

export default class Main {
    constructor() {
        this.localStorage = new LocalStorage();
        this.localStorage.initialize();
        this.DOM = new DOM();
        this.inbox = new Inbox();
        this.today = new Today();
        this.upcoming = new Upcoming();
    }

    initialize() {
        this.DOM.initialize();
        this.inbox.initialize();
        this.today.initialize();
        this.upcoming.initialize();
        const tasks = this.localStorage.getTasks();
        tasks.forEach(task => task.addEventListeners());
    }
}
const mainApp = new Main();
mainApp.initialize();