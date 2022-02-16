import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
