import { Test, TestingModule } from '@nestjs/testing';
import { AffiliatesService } from '../../src/modules/affiliates/affiliates.service';
import { getModelToken } from '@nestjs/mongoose';
import { Affiliate } from '../../src/modules/affiliates/schemas/affiliate.schema';
import { RegisterAffiliateDto } from '../../src/modules/affiliates/dto/register-affiliate.dto';

describe('AffiliatesService', () => {
  let service: AffiliatesService;
  let mockAffiliateModel: any;

  const mockAffiliate = {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'Juan',
    lastName: 'Pérez',
    phoneNumber: '+584121234567',
    dni: '12345678',
    gender: 'M',
    birthDate: new Date('1990-01-15'),
    age: 35,
    usdAnnualFee: 15,
    fullName: 'Juan Pérez',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockAffiliateModel = jest.fn().mockImplementation((dto) => {
      const instance = {
        ...dto,
        age: undefined,
        usdAnnualFee: undefined,
        save: jest.fn().mockImplementation(function () {
          // Simulate the service setting age and usdAnnualFee before save
          return Promise.resolve({
            ...dto,
            _id: 'mockId',
            age: this.age,
            usdAnnualFee: this.usdAnnualFee,
          });
        }),
      };
      return instance;
    });

    mockAffiliateModel.find = jest.fn();
    mockAffiliateModel.countDocuments = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffiliatesService,
        {
          provide: getModelToken(Affiliate.name),
          useValue: mockAffiliateModel,
        },
      ],
    }).compile();

    service = module.get<AffiliatesService>(AffiliatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should return paginated affiliates with default values', async () => {
      const mockAffiliates = [mockAffiliate];
      const mockTotalItems = 1;

      const mockExec = jest.fn().mockResolvedValue(mockAffiliates);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });

      mockAffiliateModel.find.mockReturnValue({ skip: mockSkip });
      mockAffiliateModel.countDocuments.mockResolvedValue(mockTotalItems);

      const result = await service.findMany({});

      expect(result).toEqual({
        items: mockAffiliates,
        page: 1,
        limit: 5,
        totalItems: mockTotalItems,
        hasPrev: false,
        hasNext: false,
      });
      expect(mockAffiliateModel.find).toHaveBeenCalledWith(
        {},
        expect.any(Object),
      );
      expect(mockAffiliateModel.countDocuments).toHaveBeenCalledWith({});
    });

    it('should return paginated affiliates with custom page and limit', async () => {
      const mockAffiliates = [mockAffiliate];
      const mockTotalItems = 25;

      const mockExec = jest.fn().mockResolvedValue(mockAffiliates);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });

      mockAffiliateModel.find.mockReturnValue({ skip: mockSkip });
      mockAffiliateModel.countDocuments.mockResolvedValue(mockTotalItems);

      const result = await service.findMany({ pageNumber: 2, pageLimit: 5 });

      expect(result).toEqual({
        items: mockAffiliates,
        page: 2,
        limit: 5,
        totalItems: mockTotalItems,
        hasPrev: true,
        hasNext: true,
      });
      expect(mockSkip).toHaveBeenCalledWith(5); // (2-1) * 5
    });

    it('should filter affiliates by DNI', async () => {
      const mockAffiliates = [mockAffiliate];
      const mockTotalItems = 1;
      const filterByDni = '12345';

      const mockExec = jest.fn().mockResolvedValue(mockAffiliates);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });

      mockAffiliateModel.find.mockReturnValue({ skip: mockSkip });
      mockAffiliateModel.countDocuments.mockResolvedValue(mockTotalItems);

      const result = await service.findMany({ filterByDni });

      expect(result).toEqual({
        items: mockAffiliates,
        page: 1,
        limit: 5,
        totalItems: mockTotalItems,
        hasPrev: false,
        hasNext: false,
      });
      expect(mockAffiliateModel.find).toHaveBeenCalledWith(
        { dni: { $regex: filterByDni, $options: 'i' } },
        expect.any(Object),
      );
      expect(mockAffiliateModel.countDocuments).toHaveBeenCalledWith({
        dni: { $regex: filterByDni, $options: 'i' },
      });
    });

    it('should correctly calculate hasPrev and hasNext', async () => {
      const mockAffiliates = Array(5).fill(mockAffiliate);
      const mockTotalItems = 15;

      const mockExec = jest.fn().mockResolvedValue(mockAffiliates);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });

      mockAffiliateModel.find.mockReturnValue({ skip: mockSkip });
      mockAffiliateModel.countDocuments.mockResolvedValue(mockTotalItems);

      const result = await service.findMany({ pageNumber: 2, pageLimit: 5 });

      expect(result.hasPrev).toBe(true); // page 2, so has previous
      expect(result.hasNext).toBe(true); // 5 + 5 < 15, so has next
    });
  });

  describe('create', () => {
    it('should create a new affiliate with calculated age and annual fee', async () => {
      const registerDto: RegisterAffiliateDto = {
        firstName: 'María',
        lastName: 'González',
        phoneNumber: '+584129876543',
        dni: '87654321',
        gender: 'F',
        birthDate: new Date('1995-05-20'),
      };

      const result = await service.create(registerDto);

      expect(result).toHaveProperty('dni', '87654321');
      expect(result).toHaveProperty('_id');
    });

    it.each([
      {
        description: 'age between 0-50',
        birthDate: '2000-01-01',
        expectedFee: 15,
        dni: '11111111',
      },
      {
        description: 'age between 51-70',
        birthDate: '1963-01-01',
        expectedFee: 20,
        dni: '22222222',
      },
      {
        description: 'age between 71-90',
        birthDate: '1948-01-01',
        expectedFee: 25,
        dni: '33333333',
      },
      {
        description: 'age equal or more than 91',
        birthDate: '1930-01-01',
        expectedFee: 30,
        dni: '44444444',
      },
      {
        description: 'age exactly 50 (boundary)',
        birthDate: '1975-10-06',
        expectedFee: 15,
        dni: '55555555',
      },
      {
        description: 'age exactly 51 (boundary)',
        birthDate: '1974-10-06',
        expectedFee: 20,
        dni: '66666666',
      },
      {
        description: 'age exactly 70 (boundary)',
        birthDate: '1955-10-06',
        expectedFee: 20,
        dni: '77777777',
      },
      {
        description: 'age exactly 71 (boundary)',
        birthDate: '1954-10-06',
        expectedFee: 25,
        dni: '88888888',
      },
      {
        description: 'age exactly 90 (boundary)',
        birthDate: '1935-10-06',
        expectedFee: 25,
        dni: '99999999',
      },
    ])(
      'should calculate correct annual fee for $description',
      async ({ birthDate, expectedFee, dni }) => {
        const registerDto: RegisterAffiliateDto = {
          firstName: 'Test',
          lastName: 'User',
          phoneNumber: `+58412${dni}`,
          dni: dni,
          gender: 'M',
          birthDate: new Date(birthDate),
        };

        const result = await service.create(registerDto);

        expect(result).toHaveProperty('dni', dni);
        expect(result).toHaveProperty('usdAnnualFee', expectedFee);
        expect(result).toHaveProperty('_id');
      },
    );
  });
});
