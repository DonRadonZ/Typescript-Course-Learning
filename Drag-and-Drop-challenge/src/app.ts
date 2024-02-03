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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor(
        templateId: string,
        hostElementId: string,
        insertAtStart: boolean,
        newElementId?: string
    ) {
        this.templateElement = <HTMLTemplateElement>document.getElementById(
            templateId
        )!;
        this.hostElement = <T>document.getElementById(hostElementId)!;

         const importedNode = document.importNode(
            this.templateElement.content,
            true);
        
        this.element = <U>importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element
        );
    }

    abstract configure?(): void;
    abstract renderContent(): void;

}

// Information class
class WorkList extends Component<HTMLDivElement, HTMLElement>{
    assignedWorks: Works[]

    constructor(private type: 'active' | 'finished') {
        super('project-list','app', false, `${type}-projects`);
        this.assignedWorks = [];

        this.configure();
        this.renderContent();
    }

    configure() {
        workState.addListener((works: Works[]) => {
            const relevantWorks = works.filter(wk => {
                if (this.type === 'active') {
                    return wk.status === WorkStatus.Active;
                }
                return wk.status === WorkStatus.Finished;
            });
            this.assignedWorks = relevantWorks;
            this.renderWorks();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent =
            this.type.toUpperCase() + ' PROJECTS';
        
    }

    private renderWorks() {
        const listEl = <HTMLUListElement>document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        for (const wkItem of this.assignedWorks) { 
            const listItem = document.createElement('li');
            listItem.textContent = wkItem.title;
            listEl.appendChild(listItem);
        }
    }



}

// Work Type

enum WorkStatus {Active, Finished}
class Works{
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: WorkStatus
    ) { }
}

// Work State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}
class WorkState extends State<Works> {
    
    private works: Works[] = [];  
    private static instance: WorkState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new WorkState();
        return this.instance;
    }
    
    
    addWork(title: string, description: string, numOfPeople: number) {
        const newWork = new Works(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            WorkStatus.Active
        );
        this.works.push(newWork);
        for (const listenerFn of this.listeners) {
          listenerFn(this.works.slice());
        }
    }
}

const workState = WorkState.getInstance(); 

// Input Class
class WorkInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    // submitElement: HTMLButtonElement;

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

const WkInput = new WorkInput();

const activeWkList = new WorkList('active');
const finishedWkList = new WorkList('finished');

