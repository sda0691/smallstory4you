export class News {
    constructor(
        public id: number,
        public groupId: number,
        public groupName: string,
        public title: string,
        public note: string,
        public whoCreated: string,
        public author: string,
        public whenCreated: Date,
        public youtubeLink: string,
        public fileName: Array<string>,
        public viewCount: number,
        public downloadUrl: Array<string>,
        public isPublic: string
    ) {}
}

