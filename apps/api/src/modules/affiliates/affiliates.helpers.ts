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

export function ageFromBornDate(bornDate: Date | string): number | null {
  const born = dayjs(bornDate);
  if (!born.isValid()) return null;

  const now = dayjs();
  return now.diff(born, 'year');
}
