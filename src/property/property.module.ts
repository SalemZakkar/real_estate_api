require('./property.policy');
require('./property.errors');
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entites/property.entity';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { FileModule } from '../file/file.module';
import { CityModule } from '../city/city.module';
import { PropertySaved } from './entites/property-saved.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property , PropertySaved]), FileModule, CityModule],
  providers: [PropertyService],
  controllers: [PropertyController],
})
export class PropertyModule {}
