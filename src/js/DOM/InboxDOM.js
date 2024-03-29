export default class InboxDOM {
    constructor() {
        // Get the form, form button, finish button, and cancel button
        this.form = document.querySelector(".new-project");
        this.formBtn = document.querySelector(".add-project-btn");
        this.finishBtn = document.querySelector(".new-project .add");
        this.cancelBtn = document.querySelector(".new-project .cancel-add");

        // Add event listeners to the form buttons
        this.formBtn.addEventListener("click", (event) => {
            event.preventDefault();
            this.showForm();
        });
        this.cancelBtn.addEventListener("click", (event) => {
            event.preventDefault();
            this.hideForm();
        });
        this.finishBtn.addEventListener("click", (event) => {
            event.preventDefault();
            this.hideForm();
        });
    }

    showForm() {
        // Shows form, hides formButton
        this.form.classList.toggle("d-none");
        this.formBtn.classList.toggle("d-none");
    }

    hideForm() {
        // Shows formButton, hides form
        this.form.classList.toggle("d-none");
        this.formBtn.classList.toggle("d-none");
    }
}

