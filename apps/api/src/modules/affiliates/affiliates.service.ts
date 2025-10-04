import { Injectable } from '@nestjs/common';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Affiliate } from './schemas/affiliate.schema';
import { Model } from 'mongoose';
import { ageFromBornDate, calculateUsdAnnualFee } from './affiliates.helpers';
import { PAGINATE_DEFAULT_LIMIT } from '../../constants';

@Injectable()
export class AffiliatesService {
  constructor(
    @InjectModel(Affiliate.name) private affiliateModel: Model<Affiliate>,
  ) {}

  async findAll(
    pageNumber: number = 1,
    pageLimit: number = PAGINATE_DEFAULT_LIMIT,
  ) {
    const skipNumber = (pageNumber - 1) * pageLimit;
    const affiliates = await this.affiliateModel
      .find({}, { fullName: 1, dni: 1, age: 1, usdAnnualFee: 1 })
      .skip(skipNumber)
      .limit(pageLimit)
      .lean({ virtuals: true })
      .exec();

    const response = {
      items: affiliates,
      page: pageNumber,
      limit: pageLimit,
      total: affiliates.length,
    };
    return response;
  }

  async create(registerAffiliateDto: RegisterAffiliateDto) {
    const affiliateInstance = new this.affiliateModel(registerAffiliateDto);
    const affiliateAge = ageFromBornDate(affiliateInstance.bornDate);
    const affiliateUsdAnnualFee = calculateUsdAnnualFee(affiliateAge);

    affiliateInstance.age = affiliateAge;
    affiliateInstance.usdAnnualFee = affiliateUsdAnnualFee;

    const createdAffiliate = await affiliateInstance.save();
    return createdAffiliate;
  }
}
