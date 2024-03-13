import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Follow, Otp, User } from 'src/entities/index.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp, Follow]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: true,
        port: 465,
        auth: {
          user: '63010069@kmitl.ac.th',
          pass: 'ewvd bemy iwgz vjnb',
        },
      },
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600m' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}