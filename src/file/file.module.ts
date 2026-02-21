import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppFile } from './entity/app-file.entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AppFile]) , FileModule],
  providers: [FileService],
  controllers: [
    FileController
  ],
  exports: [FileService],
})
export class FileModule {}
