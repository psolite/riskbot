
import { Exclude } from "class-transformer";
import { IsUUID } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ schema: 'riskonly' })
export class Auth {

    @PrimaryGeneratedColumn('uuid')
    @IsUUID('5')
    String_id: string;

    @Column()
    name: string;

    @Column()
    telegram_id: string;

    @Column({ nullable: true })
    referral_id: string;

    @Column({ nullable: true })
    referral_by: string;

    @Column({ nullable: true })
    Isactive: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

