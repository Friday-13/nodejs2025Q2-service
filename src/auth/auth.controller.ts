import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { logRequest, logResponse } from 'src/logging/endpoint-logs.util';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoggingService } from 'src/logging/logging.service';
import { LoginUserDto } from './dto/login-user.dto';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';
import InvalidCredentials from './errors/invalid-credentials.error';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private logging: LoggingService,
  ) {
    this.logging.setContext('Users');
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: "Login with user's login and password",
    description: "Login with user's login and password",
  })
  @ApiOkResponse({
    //TODO: add correct OK response
    description: 'User data',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Incorrect login or password' })
  async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
    logRequest(this.logging, req);
    try {
      const response = await this.authService.login(
        loginUserDto.login,
        loginUserDto.password,
      );
      logResponse(this.logging);
      return response;
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new ForbiddenException(err.message);
      }
      if (err instanceof InvalidCredentials) {
        throw new ForbiddenException(err.message);
      }
      throw err;
    }
  }
}
