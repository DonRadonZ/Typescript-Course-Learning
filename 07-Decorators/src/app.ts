// A First Class Destr.substring(indexStart, indexEnd).substring(indexStart, indexEnd)

function Logger(logString: string) {
    console.log('LOGGER FACTORY')
    return function (constructor: Function) {
        console.log(logString);
        console.log(constructor);
    }
}

//Building More Useful Decorators

function WithTemplate(template: string, hookId: string) {
    console.log('TEMPLATE FACTORY');
    return function<T extends {new(...args: any[]): {name: string}} > (originalConstructor: T) {    
     // Returning (and changing) a Class in a Class Decorator
        return class extends originalConstructor {
            constructor(..._: any[]) {
                super();
                console.log('Rendering template')
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
            hookEl.innerHTML = template;
            hookEl.querySelector('h1')!.textContent = this.name;
        }
    }
  }
 }
}


@WithTemplate('<h1>My Preson Object</h1>', 'app')

// @Logger('LOGGING - PERSON')

//Adding Multiple Decorators
@Logger('LOGGING')
class Person {
    name = 'Don'

    constructor() {
        console.log('Creating person info obj...')
    }
}

const pers = new Person();

console.log(pers);

// ---

function Log(target: any, propertyName: string | Symbol) {
    console.log('Property decorator!');
    console.log(target, propertyName);
}

// Accessor & Parameter Decorators

function Log2(target: any, name: string, descriptor: PropertyDescriptor){
    console.log('Accessor decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log3(
    target: any, 
    name: string | Symbol, 
    descriptor: PropertyDescriptor
)   {
    console.log('Accessor decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
    console.log('Parameter decorator!');
    console.log(target);
    console.log(name);
    console.log(position);
}


class Product {
    @Log
    title: string;
    private _price: number;
    
    @Log2
    set price(val: number){
        if (val > 0) {
        this._price = val;
        } else {
            throw new Error('Invalid price - should be positive!')
        }
    }
    
    constructor(t: string, p: number){
        this.title = t;
        this._price = p;
    }

    @Log3
    getPriceWithTax(@Log4 tax: number){
        return this._price * (1 + tax);
    }
}

// When Do Decorators Execute?
const p1 = new Product('Book', 19);
const p2 = new Product('Book 2', 29)

// Example: Creating an "Autobind" Decorator


function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            // this is Extra layer
            const boundFn = originalMethod;
            return boundFn
        }
    };
    return adjDescriptor;
}

class Printer {
    message = 'This works!';

    @Autobind
    showMessage() {
        console.log(this.message);
    }
}

const p = new Printer();
p.showMessage()
const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);

// Validation with Decorators
// ---

interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[] // ['required', 'positive']
    }
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
            [propName]: ['required']
        
    }
}



function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ['positive']
    }
 }

function validate(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig) {
        return true;
    }
    let isValid = true;
    for (const prop in objValidatorConfig) {
        console.log(prop);
        for (const validator of objValidatorConfig[prop]) {
            switch (validator) {
                case 'required':
                    isValid = isValid && !!obj[prop];
                    break;
                case 'positive':
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }
    return isValid;
}
class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;

    const title = titleEl.value;
    const price = +priceEl.value;

    

    const createCourse = new Course(title, price);

    if (!validate(createCourse)) {
        alert('Invalid input, please try again!');
        return;
    }
})
