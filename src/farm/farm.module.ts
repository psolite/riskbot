import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/auth/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]),AuthModule],
  providers: [FarmService],
  exports: [FarmService]
})
export class FarmModule {}
