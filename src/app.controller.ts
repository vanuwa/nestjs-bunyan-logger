import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  health() {
    return this.appService.health();
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return req.user;
  }

  @Get('/test')
  async test() {
    return this.appService.test();
  }
}
