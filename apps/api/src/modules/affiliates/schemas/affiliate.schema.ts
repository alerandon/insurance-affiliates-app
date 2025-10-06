import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GENDER_VALUES, GenderType } from '@myguardcare-affiliates-types';
import * as mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type AffiliateDocument = HydratedDocument<Affiliate>;

@Schema({ timestamps: true })
export class Affiliate {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
  })
  phoneNumber: string;

  @Prop({ unique: true, required: true })
  dni: string;

  @Prop({ required: true, enum: GENDER_VALUES })
  gender: GenderType;

  @Prop({ min: 0, default: null })
  age: number;

  @Prop({ min: 0, default: null })
  usdAnnualFee: number;

  @Prop({ required: true })
  birthDate: Date;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);
AffiliateSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const leanVirtualsPlugin: any =
  (mongooseLeanVirtuals as any)?.default ?? mongooseLeanVirtuals;
AffiliateSchema.plugin(leanVirtualsPlugin);
