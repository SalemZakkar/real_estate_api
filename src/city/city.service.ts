import { Repository } from 'typeorm';
import { City } from './entity/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City) private readonly repo: Repository<City>,
  ) {}
  findAll() {
    return this.repo.find();
  }
}
