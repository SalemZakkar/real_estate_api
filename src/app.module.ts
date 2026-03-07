import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PropertyModule } from './property/property.module';
import { CityModule } from './city/city.module';
import { AppDataSource } from './database/ds';
import { AdBannerModule } from './adbanner/ad-banner.module';
import { AboutUsModule } from './about_us/about-us.module';
import { SettingsModule } from './settings/settings.module';
import {CacheModule} from "@nestjs/cache-manager";
import { ClientVersionGuard } from './common/guards/version.guard';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => AppDataSource.options,
    }),
    FileModule,
    AuthModule,
    UserModule,
    PropertyModule,
    CityModule,
    AboutUsModule,
    AdBannerModule,
    SettingsModule,
  ],
  providers: [
    ClientVersionGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
