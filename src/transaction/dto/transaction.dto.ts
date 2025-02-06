import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TransactionSchema = z.object({
  senderAccNo: z.number().positive(),
  senderAccPassword: z.string().nonempty(),
  receiverAccNo: z.number().positive(),
  amount: z.number().positive(),
});

export class TransactionDto extends createZodDto(TransactionSchema) {}
