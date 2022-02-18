import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/userSignUp.dto';
import { Users } from './entities/users.entity';
import bcrypt from 'bcrypt';
import { PasswordChangeDto } from './dto/passwordChange.dto';

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

  async passwordChange(passwordChangeDto: PasswordChangeDto) {
    const { password, newPassword, newPasswordCheck } = passwordChangeDto;

    const user = await this.usersRepository.findOne(1, { select: ['password'] });
    if (!user) throw new ForbiddenException('Invalid User');

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) throw new BadRequestException('Invalid Password');

    if (password === newPassword) throw new BadRequestException('Cannot use same password');
    this.passwordCheck(newPassword, newPasswordCheck);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersRepository.createQueryBuilder().update().set({ password: hashedPassword }).where('id = :id', { id: 1 }).execute();
  }
}
