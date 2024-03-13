import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fridge, User } from 'src/entities/index.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FridgeService {
  constructor(
    @InjectRepository(Fridge)
    private readonly fridgeRepository: Repository<Fridge>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, id: string) {
    const user = await this.userRepository.findOne({
      where: { User_ID: id },
      relations: ['Fridge'],
    });
    const temp = new Fridge();
    temp.NameFridge = name;
    const res = await this.fridgeRepository.save(temp);
    if (user.Fridge) user.Fridge.push(res);
    else user.Fridge = [res];
    await this.userRepository.save(user);
    return user;
  }

  async EditGuop(namegoup: string, uuid: any) {
    const fridge = await this.fridgeRepository.findOne({
      where: { Fridge_ID: uuid },
    });
    fridge.NameFridge = namegoup;
    console.log(fridge);

    await this.fridgeRepository.save(fridge);
    return fridge;
  }

  async AddGuop(Username: string, uuid: string) {
    const user = await this.userRepository.findOne({
      where: { UserName: Username },
      relations: ['Fridge'],
    });

    const res = await this.fridgeRepository.findOne({
      where: { Fridge_ID: uuid },
    });
    if (user.Fridge) user.Fridge.push(res);
    else user.Fridge = [res];
    const result = await this.userRepository.save(user);
    return result
  }

  async removeGuop(Username: string, uuid: string) {
    const res = await this.fridgeRepository.findOne({
      where: { Fridge_ID: uuid },
      relations: ['Member'],
    });
    console.log("res: ",res)
    res.Member = res.Member.filter((x) => x.UserName != Username);
    return await this.fridgeRepository.save(res);
  }

  async Guop( uuid: string) {
    const res = await this.fridgeRepository.findOne({
      where: { Fridge_ID: uuid },
      relations: ['Member'],
    });
    res.Member ;
    return await this.fridgeRepository.save(res);
  }
}
