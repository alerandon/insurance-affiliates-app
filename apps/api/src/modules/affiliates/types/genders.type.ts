export const GENDER_VALUES = ['M', 'F'] as const;
export type GenderType = (typeof GENDER_VALUES)[number];
