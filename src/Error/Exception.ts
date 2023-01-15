export class Exception extends Error {
    constructor(public name: string, message: string) {
        super(message);
        Object.setPrototypeOf(this, Exception.prototype);
    }

    toString(): string {
        const errMsg = this.message ? `${this.name} - ${this.message}` : this.name;
        return errMsg;
    }
}
