import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';
import { CycleLog, CycleLogSchema } from './schemas/cycle-log.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: CycleLog.name, schema: CycleLogSchema },
    ]),
  ],
  controllers: [CycleController],
  providers: [CycleService],
  exports: [CycleService, MongooseModule],
})
export class CycleModule {}
