import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { formattingPhoneNumber } from '../affiliates.helpers';
import { GENDER_VALUES, GenderType } from '../types/genders.type';

export type AffiliateDocument = HydratedDocument<Affiliate>;

@Schema({ timestamps: true })
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

  @Prop({ required: true, enum: GENDER_VALUES })
  genre: GenderType;

  @Prop()
  age: number;

  @Prop()
  usdAnnualFee: number;

  @Prop({ required: true })
  bornDate: Date;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);

AffiliateSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

AffiliateSchema.set('toJSON', { virtuals: true });
AffiliateSchema.set('toObject', { virtuals: true });
