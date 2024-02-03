// Drag & Drop Interface
interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
    dragOverHandler(event: DragEvent): void; 
    dropHandler(event: DragEvent): void; 
    dragLeaveHandler(event: DragEvent): void; 
}

// Work Type
enum WorkStatus {
    Active,
    Finished
}
class Work{
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

class WorkState extends State<Work> {
    private works: Work[] = [];  
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
        const newWork = new Work(
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


// WorkItem Class
class WorkItem extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable{
    private work: Work;
    get persons() {
        if (this.work.people === 1) {
            return '1 person';
        } else {
            return `${this.work.people} persons`;
        }
    }
    constructor(hostId:string, work:Work) {
        super('single-project', hostId, false, work.id);
        this.work = work;

        this.configure();
        this.renderContent();
    }
    
    @Autobind
    dragStartHandler(event: DragEvent) {
        console.log(event);  
    }
    dragEndHandler(_: DragEvent) {
        console.log('DragEnd');
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    
    renderContent() {
        this.element.querySelector('h2')!.textContent = this.work.title;
        this.element.querySelector('h3'
        )!.textContent = this.persons + 'Person assigned';
        this.element.querySelector('p')!.textContent = this.work.description;
    }
}

// WorkList Class
class WorkList extends Component<HTMLDivElement, HTMLElement> implements
    DragTarget{
    assignedWorks: Work[]

    constructor(private type: 'active' | 'finished') {
        super('project-list','app', false, `${type}-projects`);
        this.assignedWorks = [];

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragOverHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable');
    }

    dropHandler(_: DragEvent) {
        

    }

    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        workState.addListener((works: Work[]) => {
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
            this.type.toUpperCase() + ' WORKS';
        
    }

    private renderWorks() {
        const listEl = document.getElementById(
            `${this.type}-projects-list`
        )! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const wkItem of this.assignedWorks) { 
            new WorkItem(this.element.querySelector('ul')!.id, wkItem)
        }
    }

}


// Input Class
class WorkInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const WkInput = new WorkInput();

const activeWkList = new WorkList('active');
const finishedWkList = new WorkList('finished');

