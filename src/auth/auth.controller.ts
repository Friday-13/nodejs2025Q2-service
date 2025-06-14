import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { logRequest, logResponse } from 'src/logging/endpoint-logs.util';
import { AuthService } from './auth.service';
import { LoggingService } from 'src/logging/logging.service';
import { LoginUserDto } from './dto/login-user.dto';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';
import InvalidCredentials from './errors/invalid-credentials.error';
import { ResponseLoginDto } from './dto/login-response.dto';
import { Public } from './public.decorator';
import { SignUpUserDto } from './dto/signup-user.dto';
import { ResponseSignupDto } from './dto/signup-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private logging: LoggingService,
  ) {
    this.logging.setContext('Users');
  }

  @Post('login')
  @Public()
  @HttpCode(200)
  @ApiOperation({
    summary: "Login with user's login and password",
    description: "Login with user's login and password",
  })
  @ApiOkResponse({
    description: 'Access token',
    type: ResponseLoginDto,
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

  @Post('signup')
  @Public()
  @ApiOperation({
    summary: 'Create new user with given login and password',
    description: 'Create new user with given login and password',
  })
  @ApiCreatedResponse({
    description: 'Created user id',
    type: ResponseSignupDto,
  })
  @ApiForbiddenResponse({ description: 'User with this login already exists' })
  async signup(@Req() req: Request, @Body() signupUserDto: SignUpUserDto) {
    logRequest(this.logging, req);
    try {
      const response = await this.authService.signup(
        signupUserDto.login,
        signupUserDto.password,
      );
      logResponse(this.logging);
      return response;
    } catch (err) {
      if (err instanceof InvalidCredentials) {
        throw new ForbiddenException(err.message);
      }
      throw err;
    }
  }
}
