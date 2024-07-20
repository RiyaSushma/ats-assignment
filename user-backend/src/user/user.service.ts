import { Injectable } from '@nestjs/common';
import { User } from '../users/auth.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
    private readonly userFilePath = path.resolve('..', '..', '..', 'localItem.json');

    private readUsersFromFile(): any[] {
        if (fs.existsSync(this.userFilePath)) {
            const userData = fs.readFileSync(this.userFilePath, 'utf-8');
            return JSON.parse(userData);
        }
        return [];
    }

    private writeUsersToFile(users: User[]): void {
        console.log('Write users:', JSON.stringify(users, null, 2));
        fs.writeFileSync(this.userFilePath, JSON.stringify(users, null, 2), 'utf-8');
    }

    findAll(): User[] {
        const rawUsers = this.readUsersFromFile();
        return rawUsers.map(user => this.mapToUserEntity(user));
    }

    findOne(id: number): User {
        const rawUsers = this.readUsersFromFile();
        const user = rawUsers.find(user => user.id === id);
        return user ? this.mapToUserEntity(user) : null;
    }

    create(user: Partial<User>): void {
        const rawUsers = this.readUsersFromFile();
        const newUser = this.mapToUserEntity({
            ...user,
            id: rawUsers.length ? rawUsers[rawUsers.length - 1].id + 1 : 1,
        });
        rawUsers.push(newUser);
        this.writeUsersToFile(rawUsers);
    }

    updateStatus(id: number, status: string): void {
        const rawUsers = this.readUsersFromFile();
        const userIndex = rawUsers.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            rawUsers[userIndex].status = status;
            this.writeUsersToFile(rawUsers.map(this.mapToUserEntity));
        }
    }

    remove(id: number): void {
        let rawUsers = this.readUsersFromFile();
        rawUsers = rawUsers.filter(user => user.id !== id);
        this.writeUsersToFile(rawUsers.map(this.mapToUserEntity));
    }

    private mapToUserEntity(rawUser: any): User {
        return {
            id: rawUser.id,
            googleId: rawUser.googleId || '',
            email: rawUser.email || '',
            name: rawUser.name || '',
            status: rawUser.status || 'active',
        } as User;
    }
}
