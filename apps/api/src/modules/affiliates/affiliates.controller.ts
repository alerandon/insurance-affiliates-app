import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllDocs } from './docs/find-all';
import { RegisterDocs } from './docs/register';

@ApiTags('Affiliates')
@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Get()
  @ApiOperation(FindAllDocs.apiOperation)
  @ApiResponse(FindAllDocs.apiResponseStatus200)
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNumber = page ? parseInt(page) : undefined;
    const pageLimit = limit ? parseInt(limit) : undefined;
    const paginatedItems = await this.affiliatesService.findAll(
      pageNumber,
      pageLimit,
    );

    const response = { data: paginatedItems };
    return response;
  }

  @Post('register')
  @ApiBody(RegisterDocs.apiBody)
  @ApiOperation(RegisterDocs.apiOperation)
  @ApiResponse(RegisterDocs.apiResponseStatus201)
  @ApiResponse(RegisterDocs.apiResponseStatus400)
  async create(@Body() registerAffiliateDto: RegisterAffiliateDto) {
    const createdAffiliate =
      await this.affiliatesService.create(registerAffiliateDto);
    const response = { data: createdAffiliate };
    return response;
  }
}
