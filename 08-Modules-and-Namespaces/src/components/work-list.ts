/// <reference path="base-component.ts"/>
/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../state/work-state.ts"/>
/// <reference path="../models/work.ts"/>
/// <reference path="../models/drag-drop.ts"/>

namespace App{
   // WorkList Class
export class WorkList extends Component<HTMLDivElement, HTMLElement> implements
    DragTarget{
    assignedWorks: Work[]

    constructor(private type: 'active' | 'finished') {
        super('project-list','app', false, `${type}-projects`);
        this.assignedWorks = [];

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
           const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable'); 
        }
    }

    dropHandler(event: DragEvent) {
        const wkId = event.dataTransfer!.getData('text/plain');
        workState.moveWork(wkId, this.type === 'active' ? WorkStatus.Active : WorkStatus.Finished)
    }

    @Autobind
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
}