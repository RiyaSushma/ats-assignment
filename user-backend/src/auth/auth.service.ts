import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../users/auth.entity';

@Injectable()
export class AuthService {
  private readonly userFilePath = path.resolve('..', '..', '..', 'data.json');

  private readUsersFromFile(): User[] {
    if (fs.existsSync(this.userFilePath)) {
      const userData = fs.readFileSync(this.userFilePath, 'utf-8');
      return JSON.parse(userData);
    }
    return [];
  }

  private writeUsersToFile(users: User[]): void {
    console.log('Writing users to file:', JSON.stringify(users, null, 2)); // Log for debugging
    fs.writeFileSync(this.userFilePath, JSON.stringify(users, null, 2), 'utf-8');
  }

  findAll(): User[] {
    return this.readUsersFromFile();
  }

  findOne(id: number): User {
    const users = this.readUsersFromFile();
    return users.find(user => user.id === id);
  }

  create(user: User): void {
    const users = this.readUsersFromFile();
    const newUser = { ...user, id: users.length ? users[users.length - 1].id + 1 : 1 }; // Assign new id
    users.push(newUser);
    this.writeUsersToFile(users);
  }

  updateStatus(id: number, status: string): void {
    const users = this.readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users[userIndex].status = status;
      this.writeUsersToFile(users);
    }
  }

  remove(id: number): void {
    let users = this.readUsersFromFile();
    users = users.filter(user => user.id !== id);
    console.log("Removing user with id:", id); // Log for debugging
    this.writeUsersToFile(users);
  }
}
