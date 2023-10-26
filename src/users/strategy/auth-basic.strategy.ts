import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  public validate = async (username, password): Promise<boolean> => {
    if (
      process.env.SA_LOGIN === username &&
      process.env.SA_PASSWORD === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
