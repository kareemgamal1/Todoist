
export class InboxDOM {
    constructor(inbox) {
        this.inbox = inbox
        this.form = document.querySelector(".new-project");
        this.addProj = document.querySelector(".add-project-btn");
        this.finishFormBtn = document.querySelector('.new-project .add')
        this.cancelFormBtn = document.querySelector('.new-project .cancel-add')

        this.addProj.addEventListener("click", () => {
            this.showForm()
        });
        this.cancelFormBtn.addEventListener('click', () => {
            this.hideForm()
        })
        this.finishFormBtn.addEventListener('click', () => {
            this.hideForm()
        })
    }

    showForm() {
        this.addProj.classList.add("d-none");
        this.form.classList.remove("d-none");
    }

    hideForm() {
        this.addProj.classList.remove("d-none");
        this.form.classList.add("d-none");
    }
    //alt for cancelBtns: Array.from(showFormBtns).map(btn => btn.nextElementSibling)
}

