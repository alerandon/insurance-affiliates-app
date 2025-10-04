import { RegisterAffiliateDto } from '../dto/register-affiliate.dto';

export const RegisterDocs = {
  apiOperation: { summary: 'Register a new affiliate' },
  apiBody: { type: RegisterAffiliateDto },
  apiResponseStatus200: {
    status: 200,
    description: 'Affiliate successfully registered.',
    schema: {
      example: {
        data: {
          id: '64b7f8f5e1b2c3d4e5f67890',
          firstName: 'Francisco',
          lastName: 'Lopez',
          phoneNumber: '+580000000000',
          dni: '12345678',
          genre: 'M',
          age: 32,
          usdAnnualFee: 15,
          bornDate: '1990-01-01T00:00:00.000Z',
          createdAt: '2025-10-02T12:34:45.678Z',
          updatedAt: '2025-10-02T12:34:45.678Z',
          fullName: 'Francisco Lopez',
        },
      },
    },
  },
};
