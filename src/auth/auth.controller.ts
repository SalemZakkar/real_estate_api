import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthTokenDto } from './dto/auth-token.dto';
import { AuthLoginPhoneDto } from './dto/auth-phone.dto';
import { NoBaseResponse } from 'core';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signIn')
  async signIn(@Body() data: AuthSignInDto) {
    return await this.authService.signIn(data);
  }

  @Post('/requestLoginOtp')
  @NoBaseResponse()
  async requestLoginOtp(@Body() data: AuthLoginPhoneDto) {
    return await this.authService.requestOtp(data.phoneNumber);
  }
  @Post('/loginOtp')
  async loginOtp(@Body() data: AuthLoginPhoneDto) {
    if (!data.code) {
      throw new BadRequestException('Code is required');
    }
    return await this.authService.loginOtp(data.phoneNumber, data.code);
  }

  @Post('/refreshToken')
  async refreshToken(@Body() data: AuthTokenDto) {
    return await this.authService.refreshToken(data.token);
  }
}
