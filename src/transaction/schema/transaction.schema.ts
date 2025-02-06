import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true }) // Automatically adds `createdAt` and `updatedAt`
export class Transaction {
  @Prop({ required: true })
  senderAccNo: number;

  @Prop({ required: true })
  receiverAccNo: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  transactionNo: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
