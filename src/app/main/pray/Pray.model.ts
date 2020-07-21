export class Pray {
    constructor(
        public id: string,
        public groupId: number,
        public groupName: string,
        public dateOfPray: Date,
        public title: string,
        public verseOfPray: string,
        public category: string,
        public word: string,
        public fileName: string,
        public downloadUrl: string
    ) {}
}