import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindManyDocs } from './docs/find-many';
import { RegisterDocs } from './docs/register';
import { checkIfDniHasConflict } from './affiliates.helpers';

@ApiTags('Affiliates')
@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Get()
  @ApiOperation(FindManyDocs.apiOperation)
  @ApiResponse(FindManyDocs.apiResponseStatus200)
  async findMany(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('filterByDni') filterByDni?: string,
  ) {
    const pageNumber = page ? parseInt(page) : undefined;
    const pageLimit = limit ? parseInt(limit) : undefined;
    const paginatedItems = await this.affiliatesService.findMany({
      pageNumber,
      pageLimit,
      filterByDni,
    });

    const response = { data: paginatedItems };
    return response;
  }

  @Post()
  @ApiBody(RegisterDocs.apiBody)
  @ApiOperation(RegisterDocs.apiOperation)
  @ApiResponse(RegisterDocs.apiResponseStatus201)
  @ApiResponse(RegisterDocs.apiResponseStatus400)
  async create(@Body() registerAffiliateDto: RegisterAffiliateDto) {
    try {
      const createdAffiliate =
        await this.affiliatesService.create(registerAffiliateDto);
      const response = { data: createdAffiliate };
      return response;
    } catch (error) {
      checkIfDniHasConflict(error);
      throw error;
    }
  }
}
