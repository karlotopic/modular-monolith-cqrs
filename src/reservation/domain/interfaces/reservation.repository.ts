export interface IReservationRepository {
  countConfirmedVipReservations(
    dateFrom: Date,
    dateTo: Date,
  ): Promise<{ propertyId: string; vipReservationCount: number }[]>;
}
