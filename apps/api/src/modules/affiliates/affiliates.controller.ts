import { Controller, Get, Post, Body } from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto';

@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post()
  create(@Body() createAffiliateDto: RegisterAffiliateDto) {
    return this.affiliatesService.create(createAffiliateDto);
  }

  @Get()
  findAll() {
    return this.affiliatesService.findAll();
  }
}
