import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly  jwtService: JwtService
    ) {}
  login(user: UserDocument, response: Response) {
    const payload: TokenPayload = { userId: user._id.toHexString() };
    const token = this.jwtService.sign(payload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    // console.log("JWT_EXPIRATION : " + this.configService.get('JWT_EXPIRATION'));
    // console.log("PORT : " + this.configService.get('PORT'));
    response.cookie('Authentication', token, { 
      httpOnly: true, 
      expires: expires, 
    });
  }
}
