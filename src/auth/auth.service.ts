import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import {
  comparePassword,
  signToken,
  decodeToken,
  ErrorCommonCodes,
} from 'core';
import { OtpService } from '../otp/otp.service';
import { OtpChannelEnum } from '../otp/entity/enum/otpchannel.enum';
import { OtpReasonEnum } from '../otp/entity/enum/otpreason.enum';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly otpService: OtpService,
  ) {}

  async signIn(data: AuthSignInDto) {
    let user = await this.userService.findOne({ email: data.email });
    if (!user) {
      throw new BadRequestException({
        code: ErrorCommonCodes.invalidCredentials,
        message: 'Wrong Credentials',
      });
    }
    if (!(await comparePassword(user.password!, data.password))) {
      throw new BadRequestException({
        code: ErrorCommonCodes.invalidCredentials,
        message: 'Wrong Credentials',
      });
    }
    let jwt = this.token(user);
    return {
      ...jwt,
      data: user,
    };
  }

  async requestOtp(phone: string) {
    let res = await this.userService.createOrExists(phone);
    let otp = await this.otpService.createOtp({
      channel: OtpChannelEnum.Phone,
      reason: OtpReasonEnum.login,
      userId: res.id,
    });
    return otp;
  }

  async loginOtp(vid: UUID, code: string) {
    let otp = await this.otpService.find({
      id: vid,
      channel: OtpChannelEnum.Phone,
      reason: OtpReasonEnum.login,
      code: code,
    });

    if (!otp) {
      throw new BadRequestException({
        code: ErrorCommonCodes.wrongOtp,
        message: 'Wrong otp',
      });
    }
    let res = await this.userService.findOne({ id: otp.user.id });
    if (!res) {
      throw new BadRequestException({
        code: ErrorCommonCodes.invalidCredentials,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    await this.otpService.delete(otp.id);
    let token = this.token(res);
    return { ...token, data: res };
  }

  async refreshToken(refreshToken: string) {
    let res = decodeToken(refreshToken, process.env.JWTR!);
    if (res.isWrong) {
      throw new BadRequestException({
        code: ErrorCommonCodes.invalidJwtToken,
        message: 'Invalid Token',
      });
    }
    if (res.isExpired) {
      throw new BadRequestException({
        code: ErrorCommonCodes.jwtTokenExpired,
        message: 'TOKEN EXPIRED',
      });
    }
    let id = res.data.id;
    let user = await this.userService.findOne({ id: id });
    if (!user) {
      throw new BadRequestException({
        code: ErrorCommonCodes.invalidJwtToken,
        message: 'Invalid Token',
      });
    }
    let jwt = this.token(user);
    return { ...jwt, data: user };
  }

  token = (params: any) => {
    let jwt = signToken({
      params: { id: params.id, email: params.email },
      expires: '2d',
      key: process.env.JWT!,
    });
    let refresh = signToken({
      params: { id: params.id, email: params.email },
      expires: '30d',
      key: process.env.JWTR!,
    });
    return { accessToken: jwt, refreshToken: refresh };
  };

  async validate(payload: any) {
    let user = await this.userService.findOne({ id: payload.id });
    if (!user) {
      throw new BadRequestException({
        code: ErrorCommonCodes.invalidJwtToken,
        message: 'Invalid Token',
      });
    }
    return user;
  }
}
