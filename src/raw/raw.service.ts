import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw_material } from 'src/entities/index.entity';

import { Repository } from 'typeorm';

@Injectable()
export class RawService {
  constructor(
    @InjectRepository(Raw_material)
    private readonly raw_materialRepository: Repository<Raw_material>,
  ) {}

  async AddRaw(name: string, calory: number) {
    const raw = await this.raw_materialRepository.findOne({
      where: { Nameing: name },
    });
    if (raw) throw new ConflictException('name is already');
    const temp = new Raw_material();
    temp.Amount = calory;
    temp.Nameing = name;
    return await this.raw_materialRepository.save(temp);
  }

  async GetRaw() {
    return await this.raw_materialRepository.find();
  }
}
