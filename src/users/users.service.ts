import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/userSignUp.dto';
import { Users } from './entities/users.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  async getUser(column): Promise<Users | null> {
    return await this.usersRepository.findOne(column);
  }

  passwordCheck(password, passowrdCheck) {
    if (!/^(?=.*\D)(?=.*\d)(?=.*\W)[\d\D\W]{8,20}$/.test(password)) {
      throw new BadRequestException('You must follow password rule');
    }

    if (password !== passowrdCheck) {
      throw new BadRequestException('Password and PasswordCheck must be same');
    }

    return;
  }

  async userSignUp(userSignUpDto: UserSignUpDto) {
    const { email, nickname, password, passwordCheck } = userSignUpDto;

    let user = await this.getUser({ email });
    if (user) throw new BadRequestException('User already Exists');

    user = await this.getUser({ nickname });
    if (user) throw new BadRequestException('User already Exists');

    this.passwordCheck(password, passwordCheck);
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.save({ email, nickname, password: hashedPassword });
  }
}
