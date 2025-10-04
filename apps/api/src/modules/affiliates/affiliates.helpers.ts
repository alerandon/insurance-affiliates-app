import parsePhoneNumber from 'libphonenumber-js';
import dayjs from 'dayjs';

export function formattingPhoneNumber(phone: string): string {
  try {
    const phoneNumber = parsePhoneNumber(phone || '');
    const formattedPhone = phoneNumber?.formatInternational() || '';
    return formattedPhone;
  } catch {
    return '';
  }
}

export function ageFromBornDate(bornDate: Date | string): number {
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
