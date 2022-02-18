import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const userFound = await this.usersRepository.createQueryBuilder().addSelect('Users.password').where('email = :email', { email }).getOne();
    if (!userFound) {
      return null;
    }

    const validatePassword = await bcrypt.compare(password, userFound.password);
    if (validatePassword) {
      const { password, ...rest } = userFound;
      return rest;
    }
    return null;
  }

  async signIn(signInUser: Users) {
    const userFound = await this.usersRepository.findOne(signInUser.id);
    if (userFound) {
      return {
        token: this.jwtService.sign({ uid: userFound.id, n: userFound.nickname })
      };
    } else if (!userFound) return null;
  }

  async tokenValidation(payload) {
    return await this.usersRepository.findOne(payload.uid);
  }
}
