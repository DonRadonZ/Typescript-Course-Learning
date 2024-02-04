    export enum WorkStatus {
      Active,
      Finished
    }
    
    export class Work{
      constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: WorkStatus
    ) {}
}

