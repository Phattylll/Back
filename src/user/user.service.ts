import {
  BadRequestException,
  ConflictException,
  Injectable,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegiterDto } from './dto/regiter.Dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Fridge, Otp, User, Follow } from 'src/entities/index.entity';
import { createReadStream } from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {



  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
  ) { }
  async regiter(regiterDto: RegiterDto) {
    if (!regiterDto.id) throw new Error('not found otp');
    const otp = await this.otpRepository.findOne({
      where: { Otp_ID: regiterDto.id },
    });
    if (!otp) throw new BadRequestException('not found otp');
    if (otp.OTP != regiterDto.otp) throw new UnauthorizedException('Wrong OTP');
    const res = await this.userRepository.findOne({
      where: { UserName: regiterDto.Username },
    });
    if (!res) {
      const temp = new User();
      temp.Email = regiterDto.Email;
      temp.UserName = regiterDto.Username;
      temp.Password = regiterDto.Password;
      temp.Name = regiterDto.Name;
      temp.TimeAT = new Date();
      return await this.userRepository.save(temp);
    }
    throw new ConflictException('Username is already');
  }

  async otp(email: string) {
    const otpGenerator = require('otp-generator');
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const ref = otpGenerator.generate(6);
    await this.mailerService.sendMail({
      to: email,
      from: '63010069@kmitl.ac.th',
      subject: 'OTP for regiter',
      text: `Your OTP is ${otp} refno:${ref}`,
    });
    const temp = new Otp();
    temp.OTP = otp;
    temp.Refno = ref;
    const res = await this.otpRepository.save(temp);
    return { id: res.Otp_ID, ref: res.Refno };
  }

  async login(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { UserName: username },
    });
    if (user?.Password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.User_ID, username: user.UserName, role: user.Role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async edit(
    uuid: string,
    name: string,
    interest: string[],
    allergies: string[],
  ) {
    const user = await this.userRepository.findOne({
      where: { User_ID: uuid },
    });
    console.log(uuid);
    
    user.Interest = interest;
    user.Allogre = allergies;
    user.Name = name;
    console.log(user);
    
    return this.userRepository.save(user);
  }
  async forget(email: string) {
    const user = await this.userRepository.findOne({ where: { Email: email } });
    await this.mailerService.sendMail({
      to: email,
      from: '63010069@kmitl.ac.th',
      subject: 'password your account',
      text: `Your password is ${user.Password} `,
    });
    return "Successful";
  }
  async img(filePath: string, id: any) {
    // const url = `${process.cwd()}/${filePath}`;
    const user = await this.userRepository.findOne({ where: { User_ID: id } });
    filePath = filePath.replace(/\\/g, "/")
    user.Image = filePath;
    return this.userRepository.save(user);
  }

  async editPassword(username: any, password: string) {
    const user = await this.userRepository.findOne({
      where: { UserName: username },
    });
    user.Password = password;
    return this.userRepository.save(user);
  }

  async myfridge(sub: string) {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Fridge', 'Fridge.AddIng_name', 'Fridge.AddIng_name.Raw'],
    });
    return user.Fridge;
  }

  async follow(sub: string, uuid: string) {
    const user_I = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Follow'],
    });
    const user_you = await this.userRepository.findOne({
      where: { User_ID: uuid },
    });
    let follow = await this.followRepository.findOne({
      where: { id_follow: sub, id_follower: uuid },
    });
    console.log(follow);
    
    if (follow)
      return await this.followRepository.remove(follow);
     follow = new Follow();
    follow.Follow = user_I;
    follow.Follower = user_you;
    follow.id_follow=sub;
    follow.id_follower=uuid
    return this.followRepository.save(follow);
  }

  // async getfollow(sub: string ) {
  //   return await this.userRepository.findOne({
  //     where: { User_ID: sub },
  //     relations: ['Follower'],
  //   });
  // }

  async getfollow(sub: string) {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Follow','Follow.Follower'],
    });
    return user.Follow;
  }

  async getfollower(sub: any) {
    return await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Follower'],
    });

  }

  async UnFollow(sub: any, uuid: string) {
    const user_I = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Follow'],
    });
    const user_you = await this.userRepository.findOne({
      where: { User_ID: uuid },
    });
    console.log(user_I, user_you);

    const follow = await this.followRepository.findOne({
      where: { Follow: user_I, Follower: user_you },
    });
    console.log(follow);
    
    if (follow)
      return await this.followRepository.remove(follow);
    throw new BadRequestException('not found');
  }

  async getRecipe(sub: any) {
    return await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['PostRecipe', "PostRecipe.Ratings", "PostRecipe.Ingredients", "PostRecipe.Ingredients.Raw_material"]
    });
  }

  async get(sub: any) {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Follow', 'Follower', 'PostRecipe', 'Save'],
    });
   const img = path.basename(user.Image);
   user.Image = img
    return user
  }


  // async getpic(sub: any): Promise<import("@nestjs/common").StreamableFile | PromiseLike<import("@nestjs/common").StreamableFile>> {
  //   const user = await this.userRepository.findOne({
  //     where: { User_ID: sub },
  //   });
  //   const file = createReadStream(user.Image);
  //   return new StreamableFile(file);
  // }
  async getpic(sub: any): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
    });
    return user.Image; // Assuming user.Image contains the filename
}

  async remove(uuid: string) {
    const user= await this.userRepository.findOne({
      where: { User_ID: uuid },
    });
    return await this.userRepository.remove(user);
  }
}