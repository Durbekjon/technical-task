import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppController {
  @Get()
  get() {
    return `Hi there.
        swagger docs: api/docs
        admin email: admin@test.com
        password: TQuaV3Q9wMV1EpW
        `;
  }
}
