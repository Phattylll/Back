import { Module } from '@nestjs/common';
import { RawController } from './raw.controller';
import { RawService } from './raw.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Raw_material } from 'src/entities/index.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Raw_material])],
  controllers: [RawController],
  providers: [RawService],
})
export class RawModule {}
