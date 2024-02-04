import Component  from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";
import { Validatable, validation } from "../util/validation.js";
import { workState } from "../state/work-state.js";

    // Input Class
export class WorkInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() { 
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = <HTMLInputElement>this.element.querySelector(
            '#title'
        )
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector(
            '#description'
        )
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector(
            '#people'
        )
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    renderContent() {}
    
    private getUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidation: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptorValidation: Validatable = {
            value: enteredDescription,
            required: true,
            minlength: 5
        }
        const peopleValidation: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 100
        }

        if (!validation(titleValidation) ||
            !validation(descriptorValidation) ||
            !validation(peopleValidation) 
        ) { 
            alert('Please input information!');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
}

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    
    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) { 
            const [title, desc, people] = userInput;
            workState.addWork(title, desc, people)
            this.clearInputs();
        }
    }
}
