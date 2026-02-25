import { Repository } from 'typeorm';
import { City } from './entity/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City) private readonly repo: Repository<City>,
  ) {}
  findAll() {
    return this.repo.find();
  }

  async findById(id: UUID) {
    let res = await this.repo.findOne({ where: { id: id } });
    if (!res) {
      throw new NotFoundException('City ' + id + ' not found');
    }
    return res;
  }
}
