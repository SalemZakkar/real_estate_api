import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PropertyModule } from './property/property.module';
import { CityModule } from './city/city.module';
import { AppDataSource } from './database/ds';
import { ContactUsModule } from './contact_us/contact-us.module';
import { AdBanner } from './adbanner/entities/ad-banner.entity';
import { AdBannerModule } from './adbanner/ad-banner.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    ContactUsModule,
    AdBannerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
