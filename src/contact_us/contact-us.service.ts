import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactUs } from './entities/contact-us.entity';
import { Repository } from 'typeorm';
import { ContactUsDto } from './dto/contact-us.dto';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ContactUsService {
  constructor(@InjectRepository(ContactUs) private readonly repo: Repository<ContactUs>) {}

  async save(dto: ContactUsDto) {
    return await this.repo.save(dto);
  }

  async getById(id: UUID) {
    let k = await this.repo.findOneBy({ id });
    if (!k) {
      throw new NotFoundException('');
    }
    return k;
  }

  async delete(id: UUID) {
    let k = await this.getById(id);
    await this.repo.remove(k);
  }

  async edit(id: UUID, dto: ContactUsDto) {
    let k = await this.getById(id);
    k.type = dto.type;
    k.value = dto.value;
    return await this.repo.save(k);
  }

  async getAll() {
    return await this.repo.find();
  }
}
