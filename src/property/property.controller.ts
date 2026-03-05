import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyCreateDto } from './dto/property-create.dto';
import { PropertyEditDto, PropertyStatusDto } from './dto/property-edit.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UUID } from 'crypto';
import {
  ImageFileValidatorPipeline,
  VideoFileValidatorPipeline,
} from '../common';
import { AuthVerificationGuard, JwtGuard, JwtOptionalGuard } from '../auth';
import { Request } from 'express';
import { PropertyGetDto, PropertyMapGetDto } from './dto/property-get.dto';
import { BasePaginationDto, CASLGuard } from 'core';
import { PropertyActions } from './property.policy';
import {
  PropertyCategory,
  PropertyDeedType,
  PropertyStatus,
  PropertyType,
} from './entites/property.enum';
import { User } from '../user/entities/user.entity';
import { UserRoleType } from '../user/entities/user-role.type';

@Controller('property')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,

    forbidNonWhitelisted: true,
  }),
)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @UseGuards(JwtOptionalGuard, CASLGuard('Property', PropertyActions.getAll))
  async getByCriteria(@Query() data: PropertyGetDto, @Req() req: Request) {
    return await this.propertyService.find(data, {
      perm: req.permissions,
      id: (req.user as any)?.id,
    });
  }
  @Get('/map')
  @UseGuards(JwtOptionalGuard, CASLGuard('Property', PropertyActions.getAll))
  async getByMap(@Query() data: PropertyMapGetDto) {
    return { data: await this.propertyService.getByMap(data) };
  }

  @Get('/mine')
  @UseGuards(JwtGuard)
  async getMine(@Query() data: BasePaginationDto, @Req() req: Request) {
    return await this.propertyService.find(
      {
        skip: data.skip,
        limit: data.limit,
        owner: (req.user as any).id,
      },
      { id: (req.user as any)?.id, perm: req.permissions },
    );
  }
  @UseGuards(JwtOptionalGuard)
  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Req() req: Request,
  ) {
    return {
      data: await this.propertyService.getById(id, {
        id: (req.user as any)?.id,
      }),
    };
  }
  @Get('metaData')
  async getImages() {
    return {
      PropertyType: Object.values(PropertyType),
      PropertyStatus: Object.values(PropertyStatus),
      PropertyCategory: Object.values(PropertyCategory),
      PropertyDeedType: Object.values(PropertyDeedType),
    };
  }

  @UseGuards(JwtGuard, AuthVerificationGuard())
  @Post()
  async create(
    @Body() dto: PropertyCreateDto,
    @Req() req: Request,
    cover: Express.Multer.File,
  ) {
    return {
      data: await this.propertyService.create(dto, (req.user as any).id),
    };
  }

  @UseGuards(JwtGuard, CASLGuard('Property', PropertyActions.edit))
  @Post(':id/video')
  @UseInterceptors(FileInterceptor('video'))
  async addVideo(
    @Param('id') id: UUID,
    @UploadedFile(new VideoFileValidatorPipeline(true))
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return {
      data: await this.propertyService.addFile(
        id,
        file,
        req.permissions,
        false,
      ),
    };
  }
  @UseGuards(JwtGuard, CASLGuard('Property', PropertyActions.edit))
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image'))
  async addImage(
    @Param('id') id: UUID,
    @UploadedFile(new ImageFileValidatorPipeline(true))
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return {
      data: await this.propertyService.addFile(id, file, req.permissions, true),
    };
  }
  @UseGuards(JwtGuard, CASLGuard('Property', PropertyActions.changeStatus))
  @Post(':id/status')
  async switchStatus(
    @Body() data: PropertyStatusDto,
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Req() req: Request,
  ) {
    return {
      data:
        (req.user as User).role == UserRoleType.Admin
          ? await this.propertyService.adminChangeStatus(id, data)
          : await this.propertyService.changeStatus(id, data, req.permissions),
    };
  }

  @UseGuards(
    JwtGuard,
    AuthVerificationGuard,
    CASLGuard('Property', PropertyActions.edit),
  )
  @Patch(':id')
  async edit(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Body() dto: PropertyEditDto,
    @Req() req: Request,
  ) {
    return {
      data: await this.propertyService.edit(id, dto, req.permissions),
    };
  }

  @UseGuards(JwtGuard, CASLGuard('Property', PropertyActions.delete))
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Req() req: Request,
  ) {
    await this.propertyService.delete(id, req.permissions);
  }

  @UseGuards(JwtGuard, CASLGuard('Property', PropertyActions.edit))
  @Delete(':id/video/:fileId')
  async deleteVideo(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Param('fileId', new ParseUUIDPipe()) fileId: UUID,
    @Req() req: Request,
  ) {
    return {
      data: await this.propertyService.deleteFile(id, fileId, req.permissions),
    };
  }

  @UseGuards(JwtGuard, CASLGuard('Property', PropertyActions.edit))
  @Delete(':id/images/:fileId')
  async deleteImage(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Param('fileId', new ParseUUIDPipe()) fileId: UUID,
    @Req() req: Request,
  ) {
    return {
      data: await this.propertyService.deleteFile(id, fileId, req.permissions),
    };
  }

  @UseGuards(JwtGuard)
  @Post(':id/save')
  async addToFavorites(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Req() req: Request,
  ) {
    await this.propertyService.save((req.user as User).id, id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/save')
  async removeFromFavorites(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Req() req: Request,
  ) {
    await this.propertyService.unSave((req.user as User).id, id);
  }
}
