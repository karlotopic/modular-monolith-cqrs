export class UserCreatedEvent {
  constructor(
    public uuid: string,
    public email: string,
    public role: string,
  ) {}
}
