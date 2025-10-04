import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDbUri } from './config/database';

@Module({
  imports: [AffiliatesModule, MongooseModule.forRoot(getDbUri())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
