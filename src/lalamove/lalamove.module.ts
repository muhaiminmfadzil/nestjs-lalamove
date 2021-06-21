import { Module } from '@nestjs/common';
import { LalamoveService } from './lalamove.service';

@Module({
  providers: [LalamoveService]
})
export class LalamoveModule {}
