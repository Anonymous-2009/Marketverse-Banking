import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AuthSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export class AuthDto extends createZodDto(AuthSchema) {}
