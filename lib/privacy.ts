export const privacyUrl = '/basketspb/privacy/';

/** Child bookings are submitted by a parent or another legal representative. */
export function validateBookingRepresentative(data: FormData) {
  const age = Number(data.get('Возраст ученика') ?? data.get('Возраст'));
  if (age > 0 && age < 18 && !String(data.get('ФИО законного представителя') ?? '').trim()) {
    throw new Error('Укажите имя и фамилию родителя или законного представителя.');
  }
}
