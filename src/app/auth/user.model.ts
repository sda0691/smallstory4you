export class User {
    constructor(
        public id: string,
        public email: string,
        public _token: string,
        public tokenExpirationDate: Date,
        public name: string,
        public role: string,
        public isAdminConfirmed: string
    ) {}
    
    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this._token;
    }

    get tokenDuration() {
        if (!this.token) {
          return 0;
        }
        return this.tokenExpirationDate.getTime() - new Date().getTime();
      }
}