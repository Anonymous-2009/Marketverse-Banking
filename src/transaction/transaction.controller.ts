import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('check')
  getHello() {
    return this.transactionService.getHello();
  }

  @Post('transfer')
  async transfer(@Body() body: TransactionDto) {
    try {
      return this.transactionService.transfer(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('history/:no') // Using route parameter
  async getHistory(@Param('no') accountNumber: number) {
    return this.transactionService.getHistory(accountNumber);
  }

  @Get('transaction/:no') // Using route parameter
  async getTrans(@Param('no') no: number) {
    return this.transactionService.gettransaction(no);
  }

  @Post('cancel')
  async cancel(@Body() body: TransactionDto) {
    try {
      return this.transactionService.cancel(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @Get('all') // Using route parameter
  async getAll() {
    return this.transactionService.getAllUsers();
  }
}
