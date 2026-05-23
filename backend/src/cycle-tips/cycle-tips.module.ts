import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CycleTipsController } from './cycle-tips.controller';
import { CycleTipsService } from './cycle-tips.service';
import { CycleTip, CycleTipSchema } from './schemas/cycle-tip.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CycleTip.name, schema: CycleTipSchema },
    ]),
  ],
  controllers: [CycleTipsController],
  providers: [CycleTipsService],
  exports: [CycleTipsService, MongooseModule],
})
export class CycleTipsModule {}
