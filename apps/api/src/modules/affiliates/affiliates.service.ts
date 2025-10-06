import { Injectable } from '@nestjs/common';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Affiliate } from './schemas/affiliate.schema';
import { Model } from 'mongoose';
import {
  ageFromBirthDate,
  calculateUsdAnnualFee,
  findQueryProjection,
} from './affiliates.helpers';
import { PAGINATE_DEFAULT_LIMIT } from '../../constants';

interface FindManyParams {
  pageNumber?: number;
  pageLimit?: number;
  filterByDni?: string;
}

@Injectable()
export class AffiliatesService {
  constructor(
    @InjectModel(Affiliate.name) private affiliateModel: Model<Affiliate>,
  ) {}

  async findMany({
    pageNumber = 1,
    pageLimit = PAGINATE_DEFAULT_LIMIT,
    filterByDni,
  }: FindManyParams) {
    const skipNumber = (pageNumber - 1) * pageLimit;
    const searchFilter = filterByDni
      ? { dni: { $regex: filterByDni, $options: 'i' } }
      : {};

    const countQuery = this.affiliateModel.countDocuments(searchFilter);
    const fetchQuery = this.affiliateModel
      .find(searchFilter, findQueryProjection)
      .skip(skipNumber)
      .limit(pageLimit)
      .lean({ virtuals: true })
      .exec();

    const [affiliates, totalItems] = await Promise.all([
      fetchQuery,
      countQuery,
    ]);

    const hasPrev = pageNumber > 1;
    const hasNext = skipNumber + affiliates.length < totalItems;

    const response = {
      items: affiliates,
      page: pageNumber,
      limit: pageLimit,
      totalItems: totalItems,
      hasPrev,
      hasNext,
    };
    return response;
  }

  async create(registerAffiliateDto: RegisterAffiliateDto) {
    const affiliateInstance = new this.affiliateModel(registerAffiliateDto);
    const affiliateAge = ageFromBirthDate(affiliateInstance.birthDate);
    const affiliateUsdAnnualFee = calculateUsdAnnualFee(affiliateAge);

    affiliateInstance.age = affiliateAge;
    affiliateInstance.usdAnnualFee = affiliateUsdAnnualFee;

    const createdAffiliate = await affiliateInstance.save();
    return createdAffiliate;
  }
}
