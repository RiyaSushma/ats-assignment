import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    googleId: string;

    @Column()
    email: string;

    @Column()
    displayName: string;

    @Column({ default: 'active' })
    status: string;
}