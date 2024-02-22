import { Module } from '@nestjs/common';
import { FetchService } from './fetch.service';

@Module({
    providers: [FetchService]
})
export class FetchModule {}
