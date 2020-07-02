export class Member {
    constructor(
        public id: string,
        public groupId: number,
        public groupName: string,
        public name: string,
        public phone1: string,
        public imageUrl: string,
        public address: string,
        public fileName: string,
        public homePhone: string,
        public businessPhone: string,
        public dateOfBirth: Date,
        public whoCreated: string,
        public whoUpdated: string,
        public whenCreated: Date,
        public whenUpdated: Date,
        public status: string,
        public familyMember: string,
        public ageStatus: string
    ) {}
}
