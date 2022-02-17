import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/userSignUp.dto';

@ApiTags('User')
@Controller('users')
@ApiInternalServerErrorResponse({
  description: '**관리자에게 문의하세요**',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '사용자 회원가입',
  })
  @ApiBadRequestResponse({
    description: `Bad Request`,
  })
  @Post('signup')
  async userSignUp(@Body() data: UserSignUpDto) {
    await this.usersService.userSignUp(data);
  }

  @ApiOperation({
    summary: 'email 및 nickname 중복확인',
    description: 'email 또는 nickname 둘중 하나의 값만 입력 (동시에 입력 X)',
  })
  @ApiQuery({
    description: 'email 중복여부',
    name: 'email',
    required: false,
    example: 'test@test.com',
  })
  @ApiQuery({
    description: 'nickname 중복여부',
    name: 'nickname',
    required: false,
    example: 'nickname',
  })
  @ApiOkResponse({
    description: 'OK',
    schema: { type: 'object', properties: { data: { type: 'string', enum: ['exists', 'none'] } } },
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
}
