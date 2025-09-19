export class UserNotFoundException extends Error {
  constructor(email: string) {
    super(`User not found for the given email: ${email}`);
    this.name = this.constructor.name;
  }
}
