// // Built-in Generics & What are Generics
// const names: Array<string> = []; // string[]
// // names [0].split(' ');

// const promise: Promise<number> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(10);
//   }, 2000);
// });

// promise.then(data => {
//     // data.split(' ');
// })

// Creating a Generic Function

function merge<T extends object,U extends object>(objA: T, objB: U) {
    return Object.assign( objA,objB)
}

const mergeObj = merge<{name: string, hobbies: string[]}, {age: number}>({name: 'Don',hobbies: ['Sports'] }, {age: 23});
console.log(mergeObj);

//Working with Constraints

interface Lengthy {
    length: number
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string]{
    let descriptionText = 'Got no value.';
    if (element.length === 1){
        descriptionText = 'Got 1 element.';
    } else if (element.length > 1) {
        descriptionText = 'Got ' + element.length + ' elements.';
    }
    return [element, descriptionText];
}

console.log(countAndDescribe(['Sports','Cooking']));

// The "keyof" Constraint
function extractAndConvert<T extends object, U extends keyof T>(
    obj: T, 
    key: U
    ) {
    return 'Value: ' + obj[key];
}

extractAndConvert({name: 'Max' },'name');

// Generic Classes
// Generic Type vs Union Type
class DataStorage<T extends string | number | boolean> {
    private data: T[] = [];
    
    addItem(item: T) {
        this.data.push(item);
    }

    removeItem(item: T) {
        if (this.data.indexOf(item) === -1) {
            return;
        }
        this.data.splice(this.data.indexOf(item), 1); // -1
    }

    getItems() {
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Don');
textStorage.addItem('Supachai');
textStorage.removeItem('Don');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();

// const objStorage = new DataStorage<object>();
// const maxObj = {name: 'Max'};
// objStorage.addItem(maxObj);
// objStorage.addItem({name: 'Supachai'});
// // ...
// objStorage.removeItem(maxObj);
// console.log(objStorage.getItems());

// Generic Utility Types

interface CourseGoal {
    title: string;
    description: string;
    completeUntil: Date;
}

function createCourseGoal(
    title: string,
    description: string,
    date: Date
    ): CourseGoal {
    let courseGoal: Partial<CourseGoal> = {};
    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntil = date;
    return courseGoal as CourseGoal;
}

const names: Readonly<string[]> = ['Don', 'Sports'];
// names.push('Sinka');
// names.pop();