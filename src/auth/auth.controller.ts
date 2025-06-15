import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoggingService } from 'src/logging/logging.service';
import { LoginUserDto } from './dto/login-user.dto';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';
import InvalidCredentials from './errors/invalid-credentials.error';
import { ResponseLoginDto } from './dto/login-response.dto';
import { Public } from './public.decorator';
import { SignUpUserDto } from './dto/signup-user.dto';
import { ResponseSignupDto } from './dto/signup-response.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JsonWebTokenError } from 'jsonwebtoken';
import TokenMissed from './errors/token-missed.error';

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
    description: 'Access and refresh token',
    type: ResponseLoginDto,
  })
  @ApiBadRequestResponse({
    description: 'No login or password, or they are not a strings',
  })
  @ApiForbiddenResponse({ description: 'Incorrect login or password' })
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const response = await this.authService.login(
        loginUserDto.login,
        loginUserDto.password,
      );
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
  async signup(@Body() signupUserDto: SignUpUserDto) {
    try {
      const response = await this.authService.signup(
        signupUserDto.login,
        signupUserDto.password,
      );
      return response;
    } catch (err) {
      if (err instanceof InvalidCredentials) {
        throw new ForbiddenException(err.message);
      }
      throw err;
    }
  }

  @Post('refresh')
  @HttpCode(200)
  @Public()
  @ApiOperation({
    summary: 'Get fresh access token',
    description: 'Get fresh access token',
  })
  @ApiOkResponse({
    description: 'Access and refresh tokens',
    type: ResponseLoginDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token missing but required',
  })
  @ApiForbiddenResponse({
    description: 'Refresh token is invalid or expired',
  })
  async refresh(@Body() refreshDto: RefreshDto) {
    try {
      const response = await this.authService.refresh(refreshDto);
      return response;
    } catch (err) {
      if (err instanceof TokenMissed) {
        throw new UnauthorizedException(err.message);
      }
      if (err instanceof JsonWebTokenError) {
        throw new ForbiddenException(err.message);
      }
      throw err;
    }
  }
}
