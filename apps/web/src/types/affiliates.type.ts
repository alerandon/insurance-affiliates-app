export type Affiliate = {
  _id: string
  firstName: string
  lastName: string
  fullName: string
  dni: string
  age: number
  usdAnnualFee: number
}

export type PaginatedAffiliates = {
  items: Affiliate[]
  totalItems: number
  page: number
  limit: number
  hasPrev: boolean
  hasNext: boolean
}

export const GENDER_VALUES = ['M', 'F'] as const

export type RegisterAffiliateInput = {
  firstName: string
  lastName: string
  dni: string
  phoneNumber: string
  gender: typeof GENDER_VALUES[number]
  birthDate: string | Date
}
