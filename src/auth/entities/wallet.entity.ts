
import { Exclude } from "class-transformer";
import { IsUUID } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ schema: 'riskonly' })
export class Wallet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    wallet: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

