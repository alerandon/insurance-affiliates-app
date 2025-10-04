import { Injectable } from '@nestjs/common';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto';

@Injectable()
export class AffiliatesService {
  create(createAffiliateDto: RegisterAffiliateDto) {
    return 'This action adds a new affiliate';
  }

  findAll() {
    return `This action returns all affiliates`;
  }
}
