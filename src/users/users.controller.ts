import { Body, Controller, Get, Query, Post, Patch, UseGuards, Req, HttpCode } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local/local-auth.guard';
import { PasswordChangeDto } from './dto/passwordChange.dto';

@ApiTags('User')
@Controller('users')
@ApiInternalServerErrorResponse({
  description: '**관리자에게 문의하세요**'
})
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'email 및 nickname 중복확인',
    description: 'email 또는 nickname 둘중 하나의 값만 입력 (동시에 입력 X)'
  })
  @ApiQuery({
    description: 'email 중복여부',
    name: 'email',
    required: false,
    example: 'test@test.com'
  })
  @ApiQuery({
    description: 'nickname 중복여부',
    name: 'nickname',
    required: false,
    example: 'nickname'
  })
  @ApiOkResponse({
    description: 'OK',
    schema: { type: 'object', properties: { data: { type: 'string', enum: ['exists', 'none'] } } }
  })
  @Get('info')
  async checkInfo(@Query('email') email: string, @Query('nickname') nickname: string) {
    if (email) {
      const result = await this.usersService.getUser({ email });
      return result ? { data: 'exists' } : { data: 'none' };
    } else if (nickname) {
      const result = await this.usersService.getUser({ nickname });
      return result ? { data: 'exists' } : { data: 'none' };
    }
  }

  @ApiOperation({
    summary: '회원가입',
    description: '사용자 회원가입'
  })
  @ApiBadRequestResponse({
    description:
      '- `User already Exists` 이미 존재하는 email 또는 nickname\n- `You must follow password fule` 비밀번호 규칙위반(8~20 숫자, 문자, 특수문자 최소 1개 포함)\n- `Password and PasswordCheck must be same` 비밀번호와 비밀번호 확인 불일치'
  })
  @Post('signup')
  async signUp(@Body() data: SignUpDto) {
    await this.usersService.signUp(data);
  }

  @ApiOperation({
    summary: '로그인'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@test.com' },
        password: { type: 'string', example: '1234qwer!' }
      },
      required: ['email', 'password']
    }
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiOkResponse({
    description: 'OK',
    schema: { type: 'object', properties: { token: { type: 'string', example: 'hbGciOiJIUzI1NiIsInR5cCI6IkpX' } } }
  })
  @ApiUnauthorizedResponse({
    description: '- `Invalid email or password` email 또는 비밀번호가 잘못되었습니다'
  })
  @Post('signin')
  async userSignIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  @ApiOperation({
    summary: '비밀번호 변경'
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description:
      '- `Invalid Password` 비밀번호 불일치\n- `Cannot use same password` 같은 비밀번호로 변경 불가\n- `You must follow password fule` 비밀번호 규칙위반(8~20 숫자, 문자, 특수문자 최소 1개 포함)\n- `Password and PasswordCheck must be same` 비밀번호와 비밀번호 확인 불일치'
  })
  @ApiUnauthorizedResponse({
    description: '- `Unauthorized` sign in 필요'
  })
  @ApiForbiddenResponse({
    description: '- `Invalid User` 유효하지 않은 사용자'
  })
  @Patch('password')
  async changePassword(@Body() data: PasswordChangeDto, @Req() req) {
    await this.usersService.passwordChange(data, req.user.uid);
  }
}
