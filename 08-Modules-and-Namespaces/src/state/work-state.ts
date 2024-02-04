namespace App {
    // Work State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

export class WorkState extends State<Work> {
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

    moveWork(workId: string, newStatus: WorkStatus) {
        const work = this.works.find(wk => wk.id === workId);
        if (work && work.status !== newStatus) {
            work.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.works.slice());
        }
    }
}

export const workState = WorkState.getInstance(); 
}