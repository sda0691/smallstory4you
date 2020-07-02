export class Media {
    constructor(
        public id: string,
        public groupId: number,
        public groupName: string,
        public author: string,
        public title: string,
        public subTitle: string,
        public fileName: string,
        public category: string,
        public downloadUrl: string,
        public whoCreated: string,
        public whoUpdated: string,
        public whenCreated: Date,
        public whenUpdated: Date,
        public youtubeLink: string

    ) {}
}