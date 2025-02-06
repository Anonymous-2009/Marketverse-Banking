import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }
    try {
      const findUser = await this.userModel.find({ username });

      console.log(findUser);
      if (findUser.length > 0) {
        return { message: 'User already registered ', success: true };
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds); // 🔥 Fix: Ensure `saltRounds` is passed

      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000); // Generate 10-digit account number

      const newUser = new this.userModel({
        username,
        password: hashedPassword, // Store hashed password
        accountNumber,
      });

      await newUser.save();

      return { message: 'User registered successfully', success: true };
    } catch (error) {
      console.log(error);
      return { message: 'some error occur', success: false };
    }
  }

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    try {
      const user = await this.userModel.findOne({ username });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user._id, username: user.username };
      return { access_token: this.jwtService.sign(payload), user };
    } catch (error) {
      console.log(error);
    }
  }
}
