import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entity/property.entity';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Property]), FileModule],
  providers: [PropertyService],
  controllers: [PropertyController],
})
export class PropertyModule {}
