import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/auth.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @Get()
  findAll(): User[] {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): User {
    return this.authService.findOne(id);
  }

  @Post()
  create(@Body() user: User): void {
    this.authService.create(user);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: number, @Body('status') status: string): void {
    this.authService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: number): void {
    this.authService.remove(id);
  }
}
