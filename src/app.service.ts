import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    const ressult = {
      name: 'anonymous',
      age: 21,
    };
    return ressult;
  }
}
