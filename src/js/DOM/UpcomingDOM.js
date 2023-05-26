import LocalStorage from "../localStorage";

export default class UpcomingDOM {
    initialize() {
        const INITIAL_DAYS_TO_LOAD = 5;
        const ADDITIONAL_DAYS_TO_LOAD = 5;
        const THRESHOLD = 5;
        const localStorage = new LocalStorage()
        const days = localStorage.getDays()
        const initialDays = days.slice(0, INITIAL_DAYS_TO_LOAD)
        const daysHTML = initialDays.map(day => day.addDay()).join('');
        const upcomingHTML = document.querySelector('.upcoming-page');
        upcomingHTML.insertAdjacentHTML('beforeend', daysHTML);

        initialDays.forEach(day => {
            day.initialize()
        })
        let daysLoaded = INITIAL_DAYS_TO_LOAD;

        window.addEventListener('scroll', () => {
            const contentHeight = document.body.offsetHeight;
            const yOffset = window.scrollY;
            const y = yOffset + window.innerHeight;

            if ((y >= contentHeight - THRESHOLD)) {
                const additionalDays = days.slice(daysLoaded, daysLoaded + ADDITIONAL_DAYS_TO_LOAD);
                const additionalDaysHTML = additionalDays.map(day => day.addDay()).join('');
                upcomingHTML.insertAdjacentHTML('beforeend', additionalDaysHTML);
                additionalDays.forEach(day => {
                    day.initialize()
                })
                daysLoaded += ADDITIONAL_DAYS_TO_LOAD;
            }
        });
    }
}