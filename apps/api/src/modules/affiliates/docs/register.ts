import { RegisterAffiliateDto } from '../dto/register-affiliate.dto';

export const RegisterDocs = {
  apiOperation: { summary: 'Register a new affiliate' },
  apiBody: { type: RegisterAffiliateDto },
  apiResponseStatus201: {
    status: 201,
    description: 'Affiliate successfully registered.',
    schema: {
      example: {
        data: {
          id: '64b7f8f5e1b2c3d4e5f67890',
          firstName: 'Francisco',
          lastName: 'Lopez',
          phoneNumber: '+584120000000',
          dni: '12345678',
          gender: 'M',
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
  apiResponseStatus400: {
    status: 400,
    description: 'Bad request for affiliate register.',
    schema: {
      example: {
        message: ['phoneNumber must be a valid phone number'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  },
};
