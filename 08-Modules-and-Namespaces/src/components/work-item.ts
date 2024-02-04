import { Draggable } from "../models/drag-drop.js";
import { Component } from "./base-component.js";
import { Work } from "../models/work.js";
import { Autobind } from "../decorators/autobind.js";



    // WorkItem Class
export class WorkItem extends Component<HTMLUListElement, HTMLLIElement>
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
        event.dataTransfer!.setData('text/plain', this.work.id); 
        event.dataTransfer!.effectAllowed = 'move'; 
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
