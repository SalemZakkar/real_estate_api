import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdBannerController } from './ad-banner.controller';
import { AdBanner } from './entities/ad-banner.entity';
import { FileModule } from '../file/file.module';
import { AdBannerSerivce } from './ad-banner.service';
@Module({
  imports: [TypeOrmModule.forFeature([AdBanner]) , FileModule],
  controllers: [AdBannerController],
  providers: [AdBannerSerivce],
})
export class AdBannerModule {}
