import * as dayjs from 'dayjs';

export const findQueryProjection = {
  firstName: 1,
  lastName: 1,
  fullName: 1,
  dni: 1,
  age: 1,
  usdAnnualFee: 1,
};

export function ageFromBornDate(bornDate: Date): number {
  const born = dayjs(bornDate);
  if (!born.isValid()) return 0;

  const now = dayjs();
  return now.diff(born, 'year');
}

export function calculateUsdAnnualFee(age: number): number {
  if (age >= 0 && age <= 50) return 15;
  if (age >= 51 && age <= 70) return 20;
  if (age >= 71 && age <= 90) return 25;

  return 30;
}
