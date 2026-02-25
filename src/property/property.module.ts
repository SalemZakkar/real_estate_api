require('./property.policy');
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entites/property.entity';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { FileModule } from '../file/file.module';
import { CityModule } from '../city/city.module';

@Module({
  imports: [TypeOrmModule.forFeature([Property]), FileModule, CityModule],
  providers: [PropertyService],
  controllers: [PropertyController],
})
export class PropertyModule {}
