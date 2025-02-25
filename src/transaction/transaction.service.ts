import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schema/transaction.schema';
import { User, UserDocument } from 'src/auth/schema/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  getHello() {
    const ressult = {
      name: 'anonymous',
      age: 21,
    };
    return ressult;
  }

  async transfer(body: TransactionDto) {
    const { senderAccNo, senderAccPassword, receiverAccNo, amount } = body;
    if (!senderAccNo || !senderAccPassword || !receiverAccNo || !amount) {
      throw new BadRequestException('Many field are required');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero.');
    }

    try {
      // Find sender
      const sender = await this.userModel.findOne({
        accountNumber: senderAccNo,
      });
      if (!sender) return { message: 'Sender not found', success: false };

      // Find receiver
      const receiver = await this.userModel.findOne({
        accountNumber: receiverAccNo,
      });
      if (!receiver) return { message: 'Receiver not found', success: false };

      

      // Verify sender password
      const isPasswordValid = await bcrypt.compare(
        senderAccPassword,
        sender.password,
      );
      if (!isPasswordValid)
        return { message: 'Incorrect password', success: false };


      // Check if sender has enough balance
      if (sender.balance < amount) {
        return { message: 'Insufficient balance', success: false };
      }
      // Perform transaction
      sender.balance -= amount;
      receiver.balance += amount;
      await sender.save();
      await receiver.save();

      // Create transaction record
      const transaction = await this.transactionModel.create({
        senderAccNo,
        receiverAccNo,
        amount,
        transactionNo: Math.floor(1000000000 + Math.random() * 9000000000),
      });
      return { message: 'Transaction successful', transaction, body };
    } catch (error) {
      console.log(error);
    }
  }

  async cancel(body: TransactionDto) {
    
    const { senderAccNo, receiverAccNo, amount } = body;
    if (!senderAccNo || !receiverAccNo || !amount) {
      throw new BadRequestException('Many field are required');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero.');
    }

    try {
      // Find sender
      const sender = await this.userModel.findOne({
        accountNumber: senderAccNo,
      });
      if (!sender) return { message: 'Sender not found', success: false };

      // Find receiver
      const receiver = await this.userModel.findOne({
        accountNumber: receiverAccNo,
      });
      if (!receiver) return { message: 'Receiver not found', success: false };

      // Check if sender has enough balance
      if (sender.balance < amount) {
        return { message: 'Insufficient balance', success: false };
      }
      // Perform transaction
      sender.balance -= amount;
      receiver.balance += amount;
      await sender.save();
      await receiver.save();

      // Create transaction record
      const transaction = await this.transactionModel.create({
        senderAccNo,
        receiverAccNo,
        amount,
        transactionNo: Math.floor(1000000000 + Math.random() * 9000000000),
      });
      return { message: 'Cancel Transaction successful', transaction, body };
    } catch (error) {
      console.log(error);
    }
  

    }

  async getHistory(accountNumber: number) {
    const transactions = await this.transactionModel
      .find({
        $or: [{ senderAccNo: accountNumber }, { receiverAccNo: accountNumber }],
      })
      .sort({ createdAt: -1 });

    return transactions;
  }

  async getAllUsers() {
    const data = await this.userModel.find({});
    return data;
  }
}
