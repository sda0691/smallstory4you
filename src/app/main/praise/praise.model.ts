export class Praise {
    constructor(
        public id: number,
        public groupId: number,
        public groupName: string,
        public title: string,
        public singer: string,
        public genre: string,  // 찬미, 복음성가, 본교특창
        public category: string, // 싱글, 듀엣, 찬양, 여성중창, 남성중창, 혼성중창, 남성 4중,  연주
        public format: string, // audio / video
        public youtubeLink: string,
        public fileName: string,
        public downloadUrl: string,
        public viewCount: number,
        public whoCreated: string,
        public whenCreated: Date,
        public whoUpdated: string,
        public whenUpdated: Date
    ) {}
}
export class Album {
    constructor(
        public id: string,
        public groupId: number,
        public groupName: string,        
        public userid: string,
        public albumName: string,
        public songList: Array<string>,

    ) {}
}
