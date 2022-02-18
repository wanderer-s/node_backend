import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { PasswordChangeDto } from './dto/passwordChange.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  passwordCheck(password, passowrdCheck) {
    if (!/^(?=.*\D)(?=.*\d)(?=.*\W)[\d\D\W]{8,20}$/.test(password)) {
      throw new BadRequestException('You must follow password rule');
    }

    if (password !== passowrdCheck) {
      throw new BadRequestException('Password and PasswordCheck must be same');
    }

    return;
  }

  async getUser(column): Promise<Users | null> {
    return await this.usersRepository.findOne(column);
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, nickname, password, passwordCheck } = signUpDto;

    let user = await this.usersRepository.findOne({ email });
    if (user) throw new BadRequestException('User already Exists');

    user = await this.usersRepository.findOne({ nickname });
    if (user) throw new BadRequestException('User already Exists');

    this.passwordCheck(password, passwordCheck);
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.save({ email, nickname, password: hashedPassword });
  }

  async passwordChange(passwordChangeDto: PasswordChangeDto, userId: number) {
    const { password, newPassword, newPasswordCheck } = passwordChangeDto;
    const user = await this.usersRepository.findOne(1, { select: ['password'] });
    if (!user) throw new ForbiddenException('Invalid User');

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) throw new BadRequestException('Invalid Password');

    if (password === newPassword) throw new BadRequestException('Cannot use same password');
    this.passwordCheck(newPassword, newPasswordCheck);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersRepository.createQueryBuilder().update().set({ password: hashedPassword }).where('id = :id', { id: userId }).execute();
  }
}
