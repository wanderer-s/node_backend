import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local/local-strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.register({
      secret: 'ThisIsSecret',
      signOptions: { expiresIn: '30m' }
    })
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
