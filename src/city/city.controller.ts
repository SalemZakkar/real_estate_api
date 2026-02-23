import { Controller, Get, Inject } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(@Inject() private readonly cityService: CityService) {}

  @Get()
  async findAll() {
    return { data: await this.cityService.findAll() };
  }
}
