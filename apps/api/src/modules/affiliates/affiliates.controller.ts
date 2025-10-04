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
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const paginatedResponse = this.affiliatesService.findAll(
      pageNumber,
      pageLimit,
    );

    const data = { data: paginatedResponse };
    return data;
  }

  @Post('register')
  @ApiBody(RegisterDocs.apiBody)
  @ApiOperation(RegisterDocs.apiOperation)
  @ApiResponse(RegisterDocs.apiResponseStatus200)
  async create(@Body() registerAffiliateDto: RegisterAffiliateDto) {
    const createdAffiliate =
      await this.affiliatesService.create(registerAffiliateDto);
    const data = { data: createdAffiliate };
    return data;
  }
}
