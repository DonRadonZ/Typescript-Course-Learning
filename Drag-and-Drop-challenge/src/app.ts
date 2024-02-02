// Autobind Decorator
function Autobind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn
        }
    };
    return adjDescriptor;
  }

// Validator

interface Validatable {
    value: string | number;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
}

function validation(ValidationInput: Validatable) {
    let isValid = true;
    if (ValidationInput.required) {
        isValid = isValid && ValidationInput.value.toString().trim().length !== 0;
    } if (ValidationInput.minlength != null &&
        typeof ValidationInput.value === 'string') {
        isValid = isValid && ValidationInput.value.length >= ValidationInput.minlength;
    }
     if (ValidationInput.maxlength != null &&
        typeof ValidationInput.value === 'string') {
        isValid = isValid && ValidationInput.value.length <= ValidationInput.maxlength;
    }
     if (ValidationInput.minlength != null &&
        typeof ValidationInput.value === 'number') {
        isValid = isValid && ValidationInput.value >= ValidationInput.minlength;
    }
     if (ValidationInput.maxlength != null &&
        typeof ValidationInput.value === 'number') {
        isValid = isValid && ValidationInput.value <= ValidationInput.maxlength;
    }
    return isValid
}

interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[] //['required', 'positive']
    }
}

const registeredValidators: ValidatorConfig = {}  

function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ['positive']
        }
    }

// Input Class
class WorkInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    // submitElement: HTMLButtonElement;

    constructor() { 
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(
            this.templateElement.content,
            true);
        
        this.element = <HTMLFormElement>importedNode.firstElementChild
        this.element.id = 'user-input';

        this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title')
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description')
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people')
        
        this.configure();
        this.attach();
    }

    
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
            console.log(title, desc, people);
            this.clearInputs();
        }
    }
    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const WkInput = new WorkInput();

