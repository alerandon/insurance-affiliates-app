import { Test, TestingModule } from '@nestjs/testing';
import { AffiliatesController } from '../../src/modules/affiliates/affiliates.controller';
import { AffiliatesService } from '../../src/modules/affiliates/affiliates.service';
import { RegisterAffiliateDto } from '../../src/modules/affiliates/dto/register-affiliate.dto';
import { ConflictException } from '@nestjs/common';

describe('AffiliatesController', () => {
  let controller: AffiliatesController;
  let service: AffiliatesService;

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

  const mockAffiliatesService = {
    findMany: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliatesController],
      providers: [
        {
          provide: AffiliatesService,
          useValue: mockAffiliatesService,
        },
      ],
    }).compile();

    controller = module.get<AffiliatesController>(AffiliatesController);
    service = module.get<AffiliatesService>(AffiliatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMany', () => {
    it('should return paginated affiliates with default parameters', async () => {
      const mockResponse = {
        items: [mockAffiliate],
        page: 1,
        limit: 10,
        totalItems: 1,
        hasPrev: false,
        hasNext: false,
      };

      mockAffiliatesService.findMany.mockResolvedValue(mockResponse);

      const result = await controller.findMany();

      expect(result).toEqual({ data: mockResponse });
      expect(service.findMany).toHaveBeenCalledWith({
        pageNumber: undefined,
        pageLimit: undefined,
        filterByDni: undefined,
      });
    });

    it('should return paginated affiliates with custom page and limit', async () => {
      const mockResponse = {
        items: [mockAffiliate],
        page: 2,
        limit: 5,
        totalItems: 15,
        hasPrev: true,
        hasNext: true,
      };

      mockAffiliatesService.findMany.mockResolvedValue(mockResponse);

      const result = await controller.findMany('2', '5');

      expect(result).toEqual({ data: mockResponse });
      expect(service.findMany).toHaveBeenCalledWith({
        pageNumber: 2,
        pageLimit: 5,
        filterByDni: undefined,
      });
    });

    it('should filter affiliates by DNI', async () => {
      const mockResponse = {
        items: [mockAffiliate],
        page: 1,
        limit: 10,
        totalItems: 1,
        hasPrev: false,
        hasNext: false,
      };

      mockAffiliatesService.findMany.mockResolvedValue(mockResponse);

      const result = await controller.findMany(undefined, undefined, '12345');

      expect(result).toEqual({ data: mockResponse });
      expect(service.findMany).toHaveBeenCalledWith({
        pageNumber: undefined,
        pageLimit: undefined,
        filterByDni: '12345',
      });
    });

    it('should parse string parameters to numbers correctly', async () => {
      const mockResponse = {
        items: [],
        page: 3,
        limit: 20,
        totalItems: 0,
        hasPrev: true,
        hasNext: false,
      };

      mockAffiliatesService.findMany.mockResolvedValue(mockResponse);

      await controller.findMany('3', '20', 'test');

      expect(service.findMany).toHaveBeenCalledWith({
        pageNumber: 3,
        pageLimit: 20,
        filterByDni: 'test',
      });
    });

    it('should handle empty results', async () => {
      const mockResponse = {
        items: [],
        page: 1,
        limit: 10,
        totalItems: 0,
        hasPrev: false,
        hasNext: false,
      };

      mockAffiliatesService.findMany.mockResolvedValue(mockResponse);

      const result = await controller.findMany();

      expect(result).toEqual({ data: mockResponse });
      expect(result.data.items).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create a new affiliate successfully', async () => {
      const registerDto: RegisterAffiliateDto = {
        firstName: 'María',
        lastName: 'González',
        phoneNumber: '+584129876543',
        dni: '87654321',
        gender: 'F',
        birthDate: new Date('1995-05-20'),
      };

      const createdAffiliate = {
        ...registerDto,
        _id: '507f1f77bcf86cd799439012',
        age: 29,
        usdAnnualFee: 15,
      };

      mockAffiliatesService.create.mockResolvedValue(createdAffiliate);

      const result = await controller.create(registerDto);

      expect(result).toEqual({ data: createdAffiliate });
      expect(service.create).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException when DNI already exists', async () => {
      const registerDto: RegisterAffiliateDto = {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        phoneNumber: '+584121111111',
        dni: '12345678',
        gender: 'M',
        birthDate: new Date('1990-01-01'),
      };

      const duplicateError = {
        code: 11000,
        keyValue: { dni: '12345678' },
      };

      mockAffiliatesService.create.mockRejectedValue(duplicateError);

      await expect(controller.create(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(controller.create(registerDto)).rejects.toThrow(
        'DNI already exists',
      );
    });

    it('should rethrow error if it is not a DNI conflict', async () => {
      const registerDto: RegisterAffiliateDto = {
        firstName: 'Pedro',
        lastName: 'Martínez',
        phoneNumber: '+584122222222',
        dni: '22222222',
        gender: 'M',
        birthDate: new Date('1985-01-01'),
      };

      const genericError = new Error('Database connection error');

      mockAffiliatesService.create.mockRejectedValue(genericError);

      await expect(controller.create(registerDto)).rejects.toThrow(
        'Database connection error',
      );
    });

    it('should handle duplicate error for non-DNI field', async () => {
      const registerDto: RegisterAffiliateDto = {
        firstName: 'Ana',
        lastName: 'López',
        phoneNumber: '+584123333333',
        dni: '33333333',
        gender: 'F',
        birthDate: new Date('1992-01-01'),
      };

      const duplicateError = {
        code: 11000,
        keyValue: { phoneNumber: '+584123333333' },
      };

      mockAffiliatesService.create.mockRejectedValue(duplicateError);

      // Should rethrow the error since it's not a DNI conflict
      await expect(controller.create(registerDto)).rejects.toEqual(
        duplicateError,
      );
    });

    it('should create affiliate with all valid fields', async () => {
      const registerDto: RegisterAffiliateDto = {
        firstName: 'Luis',
        lastName: 'Fernández',
        phoneNumber: '+584124444444',
        dni: '44444444',
        gender: 'M',
        birthDate: new Date('1975-03-15'),
      };

      const createdAffiliate = {
        ...registerDto,
        _id: '507f1f77bcf86cd799439015',
        age: 50,
        usdAnnualFee: 15,
        fullName: 'Luis Fernández',
      };

      mockAffiliatesService.create.mockResolvedValue(createdAffiliate);

      const result = await controller.create(registerDto);

      expect(result).toEqual({ data: createdAffiliate });
      expect(result.data).toHaveProperty('age');
      expect(result.data).toHaveProperty('usdAnnualFee');
      expect(service.create).toHaveBeenCalledWith(registerDto);
    });
  });
});
