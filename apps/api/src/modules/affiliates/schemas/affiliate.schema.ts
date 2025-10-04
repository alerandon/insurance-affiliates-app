import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { formattingPhoneNumber } from '../affiliates.helpers';

export type AffiliateDocument = HydratedDocument<Affiliate>;

@Schema()
export class Affiliate {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
    set: (phone: string) => formattingPhoneNumber(phone) ?? phone,
  })
  phoneNumber: string;

  @Prop({ unique: true, required: true })
  dni: string;

  @Prop()
  age: number;

  @Prop()
  annualFee: number;

  @Prop({ required: true })
  bornDate: Date;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);
