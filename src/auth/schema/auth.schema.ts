import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Automatically adds `createdAt` and `updatedAt`
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  accountNumber: number;

  @Prop({ default: 5000 })
  balance: number;

  @Prop({ default: () => new Date() }) // Similar to `CURRENT_TIMESTAMP`
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
