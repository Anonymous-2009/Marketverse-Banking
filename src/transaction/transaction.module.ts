import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/auth/schema/auth.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
