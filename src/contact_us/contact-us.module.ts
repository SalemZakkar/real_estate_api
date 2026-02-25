require('./contact-us.policy');
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUs } from './entities/contact-us.entity';
import { ContactUsController } from './contact-us.controller';
import { ContactUsService } from './contact-us.service';
@Module({
  imports: [TypeOrmModule.forFeature([ContactUs])],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}
