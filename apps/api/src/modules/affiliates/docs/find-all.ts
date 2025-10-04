export const FindAllDocs = {
  apiOperation: { summary: 'Get all affiliates' },
  apiResponseStatus200: {
    status: 200,
    description: 'All affiliates retrieved successfully.',
    schema: {
      example: {
        data: [
          {
            fullName: 'Francisco Lopez',
            dni: '12345678',
            age: 32,
            usdAnnualFee: 15,
          },
          {
            fullName: 'Maria Garcia',
            dni: '87654321',
            age: 35,
            usdAnnualFee: 15,
          },
        ],
      },
    },
  },
};
