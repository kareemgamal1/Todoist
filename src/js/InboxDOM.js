
export class InboxDOM {
    constructor(inbox) {
        this.inbox = inbox
        this.form = document.querySelector(".new-project");
        this.addProj = document.querySelector(".add-project-btn");
        this.cancelFormBtn = document.querySelector('.new-project .cancel-add')

        this.addProj.addEventListener("click", () => {
            this.showForm()
        });


        this.cancelFormBtn.addEventListener('click', () => {
            this.hideForm()
        })


    }

    addEventListeners() {
        const editableProjects = document.querySelectorAll(".project-name");

        editableProjects.forEach((p) => {
            p.addEventListener('click', this.makeEditable.bind(this, p));
        })
    }

    makeEditable(paragraphElement) {
        if (!paragraphElement) {
            return;
        }

        const projectHTML = paragraphElement.parentNode.parentNode
        const projectClasses = projectHTML.classList[0]
        const myRegex = /-(\d+)/;
        const projectID = projectClasses.match(myRegex)[1];

        const textValue = paragraphElement.textContent;

        // Replace the paragraph with an input field
        // Check if an input element already exists in the DOM
        let inputElement = paragraphElement.previousElementSibling;
        let noOfTasks = paragraphElement.nextElementSibling;

        if (!inputElement || inputElement.tagName !== "INPUT")
            inputElement = document.createElement("input");
        inputElement.type = "text";
        const myRegex2 = /\(([^)]+)\)/;
        const result = textValue.match(myRegex2)[1];
        inputElement.value = result;
        inputElement.classList.add("editable-input")
        paragraphElement.parentNode.insertBefore(inputElement, paragraphElement);

        inputElement.onblur = () => {
            // Update the paragraph with the new text
            const updatedTextValue = inputElement.value;
            paragraphElement.textContent = `(${updatedTextValue})`;
            noOfTasks.style.display = 'block'
            paragraphElement.style.display = "block";
            inputElement.style.display = "none";
            this.inbox.updateProject(projectID, updatedTextValue)
        }
        noOfTasks.style.display = 'none'
        paragraphElement.style.display = "none";
        inputElement.style.display = "block";
        // Focus on the input field
        inputElement.focus();
    }

    //alt for cancelBtns: Array.from(showFormBtns).map(btn => btn.nextElementSibling)
}

