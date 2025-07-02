import { Controller, Get, Injectable } from '@nestjs/common';
@Controller()
export class AppController {
  @Get()
  get(): {
    message: string;
    swaggerDocs: string;
    admin: { email: string; password: string };
  } {
    return {
      message: 'Hi there.',
      swaggerDocs: 'https://technical-task-l8ci.onrender.com/api/docs',
      admin: {
        email: 'admin@test.com',
        password: 'TQuaV3Q9wMV1EpW',
      },
    };
  }
}
