export class ReservationEntity {
  propertyId: string;

  arrival: Date;

  departure: Date;

  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';

  vip: boolean;

  constructor(
    propertyId: string,
    arrival: Date,
    departure: Date,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED',
    vip: boolean,
  ) {
    this.propertyId = propertyId;
    this.arrival = arrival;
    this.departure = departure;
    this.status = status;
    this.vip = vip;
  }
}
