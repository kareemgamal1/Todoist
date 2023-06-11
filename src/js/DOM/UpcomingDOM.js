/* eslint-disable class-methods-use-this */
import LocalStorage from "../localStorage";

export default class UpcomingDOM {
    initialize() {
        // Define constants for the number of days to load, the threshold for loading additional days, and the local storage instance
        const INITIAL_DAYS_TO_LOAD = 5;
        const ADDITIONAL_DAYS_TO_LOAD = 5;
        const THRESHOLD = 5;
        const localStorage = new LocalStorage();

        // Retrieve the days from local storage and select the initial days to load
        const days = localStorage.getDays();
        const initialDays = days.slice(0, INITIAL_DAYS_TO_LOAD);

        // Generate the HTML for the initial days and add it to the upcoming page
        const daysHTML = initialDays.map(day => day.addDay()).join("");
        const upcomingHTML = document.querySelector(".upcoming-page");
        upcomingHTML.insertAdjacentHTML("beforeend", daysHTML);

        // Initialize the initial days
        initialDays.forEach(day => {
            day.initialize();
        });

        // Track the number of days that have been loaded
        let daysLoaded = INITIAL_DAYS_TO_LOAD;

        // Add a scroll event listener to load additional days when the user scrolls to the bottom of the page
        window.addEventListener("scroll", () => {
            const contentHeight = document.body.offsetHeight;
            const yOffset = window.scrollY;
            const y = yOffset + window.innerHeight;

            // If the user has scrolled to the bottom of the page, load additional days
            if ((y >= contentHeight - THRESHOLD)) {
                // Select the next batch of days to load and generate the HTML for them
                const additionalDays = days.slice(daysLoaded, daysLoaded + ADDITIONAL_DAYS_TO_LOAD);
                const additionalDaysHTML = additionalDays.map(day => day.addDay()).join("");

                // Add the HTML for the additional days to the upcoming page and initialize them
                upcomingHTML.insertAdjacentHTML("beforeend", additionalDaysHTML);
                additionalDays.forEach(day => {
                    day.initialize();
                });

                // Update the number of days that have been loaded
                daysLoaded += ADDITIONAL_DAYS_TO_LOAD;
            }
        });
    }
}