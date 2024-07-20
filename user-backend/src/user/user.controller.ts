import { Controller, Get, Post, Param, Body, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../users/auth.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll(): User[] {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): User {
        return this.userService.findOne(id);
    }

    @Post()
    create(@Body() user: Partial<User>): void {
        this.userService.create(user);
    }

    @Put(':id/status')
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string): void {
        this.userService.updateStatus(id, status);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): void {
        this.userService.remove(id);
    }
}
