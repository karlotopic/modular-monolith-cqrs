export class UserNotFoundException extends Error {
  constructor(email: string) {
    super(`User with the email ${email} not found`);
    this.name = this.constructor.name;
  }
}
