import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    AuthModule,
    JwtModule.register({
      secret: 'ThisIsSecret',
      signOptions: { expiresIn: '30m' }
    })
  ],
  providers: [UsersService, AuthService],
  controllers: [UsersController]
})
export class UsersModule {}
