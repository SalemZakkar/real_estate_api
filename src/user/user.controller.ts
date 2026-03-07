import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  UseGuards,
  Get,
  Patch,
  UsePipes,
  Query,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CASLGuard, NoBaseResponse, PasswordMissmatchException } from 'core';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { UserUpdateDto, UserUpdateMineDto } from './dto/user-update-mine.dto';
import { JwtGuard } from '../auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserGetDto } from './dto/user-get.dto';
import { UserActions } from './user.permissions';
import { ImageFileValidatorPipeline } from '../common';
import { UserChangePasswordDto } from './dto/user-change-password.dto';

@Controller('user')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/mine')
  @UseGuards(JwtGuard)
  async getMine(@Req() req: Request) {
    return { data: req.user };
  }
  @Patch('/mine')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateMine(
    @Req() req: Request,
    @Body()
    data: UserUpdateMineDto,
    @UploadedFile(new ImageFileValidatorPipeline())
    image: Express.Multer.File,
  ) {
    let res = await this.userService.findOneAndUpdate(
      (req.user as User).id,
      data,
      image,
    );
    return { data: res };
  }

  @Delete("/mine")
  @UseGuards(JwtGuard)
  async deleteMine(@Req() req: Request) {
    return { data: await this.userService.deleteUser((req.user as User).id) };
  }

  @UseGuards(JwtGuard, CASLGuard('User', UserActions.manage))
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/:id' , )
  async updateUserById(
    @Param('id' , new ParseUUIDPipe()) id: string,
    @Body() data: UserUpdateDto,
    @UploadedFile(new ImageFileValidatorPipeline())
    image: Express.Multer.File,
  ) {
    let res = await this.userService.findOneAndUpdate(id, data, image);
    return { data: res };
  }

  @Delete('/mine/image')
  @UseGuards(JwtGuard)
  async deletePhoto(@Req() req: Request) {
    return {
      data: await this.userService.deletePhoto((req.user as User).id),
    };
  }

  @Post('/mine/changePassword')
  @UseGuards(JwtGuard)
  @UseGuards(JwtGuard, CASLGuard('User', UserActions.manage))
  async changePassword(
    @Body() params: UserChangePasswordDto,
    @Req() req: Request,
  ) {
    if (params.password != params.confirmPassword) {
      throw new PasswordMissmatchException();
    }
    await this.userService.setPassword((req.user as User).id, params.password);
    return { message: 'Password Changed Successfully' };
  }

  @UseGuards(JwtGuard, CASLGuard('User', UserActions.manage))
  @Get()
  async getByCriteria(@Query() req: UserGetDto) {
    return { ...(await this.userService.find(req)) };
  }

  @UseGuards(JwtGuard, CASLGuard('User', UserActions.manage))
  @Get('/:id')
  async getById(@Param('id' , new ParseUUIDPipe()) id: string) {
    let res = await this.userService.findOne({ id: id });
    return { data: res };
  }
}
