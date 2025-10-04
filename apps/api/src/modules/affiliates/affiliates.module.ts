import { Module } from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { AffiliatesController } from './affiliates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Affiliate, AffiliateSchema } from './schemas/affiliate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Affiliate.name, schema: AffiliateSchema },
    ]),
  ],
  controllers: [AffiliatesController],
  providers: [AffiliatesService],
})
export class AffiliatesModule {}
