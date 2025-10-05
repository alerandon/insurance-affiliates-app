import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { getDbUri } from './config/database';

@Module({
  imports: [AffiliatesModule, MongooseModule.forRoot(getDbUri())],
})
export class AppModule {}
