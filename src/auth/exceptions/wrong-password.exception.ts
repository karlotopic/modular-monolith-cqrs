export class WrongPasswordException extends Error {
  constructor(id: string) {
    super(`Wrong password exception for user ${id}`);
    this.name = this.constructor.name;
  }
}
