import { BadRequestException, Injectable } from '@nestjs/common';
import { IngredientsDto } from './dto/ingredient.Dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Add_ingredients, Fridge, Raw_material } from 'src/entities/index.entity';
import { ILike, Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Fridge)
    private readonly fridgeRepository: Repository<Fridge>,
    @InjectRepository(Add_ingredients)
    private readonly add_ingredientsRepository: Repository<Add_ingredients>,
    @InjectRepository(Raw_material)
    private readonly raw_materialRepository: Repository<Raw_material>,
  ) { }
  async add(data: IngredientsDto) {
    try {
      const fridge = await this.fridgeRepository.findOne({
        where: { Fridge_ID: data.uudifridge },
      });
      const raw = await this.raw_materialRepository.findOne({
        where: { Nameing: data.nameing },
      });
      if(!raw)
        throw new BadRequestException('raw not found');
      const add_ingredients = new Add_ingredients();
      add_ingredients.AddTime = new Date();
      add_ingredients.Amount = data.amount;
      add_ingredients.EXP = data.EXP;
      add_ingredients.Fridge = fridge;
      // add_ingredients.Keeptheplace = data.keepTheplace;
      add_ingredients.MFG = data.MFG;
      add_ingredients.Raw = raw;
      add_ingredients.NtiPeriod = data.ntPeriod;
      add_ingredients.Type = data.type;
      add_ingredients.Unit = data.Unit;
      add_ingredients.img = data.img_path;
      return await this.add_ingredientsRepository.save(add_ingredients);
    } catch (error) {
      throw new BadRequestException('raw not found');
    }
  }

  async edit(data: IngredientsDto) {
    try {
      const add_ingredients = await this.add_ingredientsRepository.findOne({
        where: { Adding_ID: data.uudiIngredients },
      });
      const raw = await this.raw_materialRepository.findOne({
        where: { Nameing: data.nameing },
      });
      if(!raw)
        throw new BadRequestException('raw not found');
      add_ingredients.AddTime = new Date();
      add_ingredients.Amount = data.amount;
      add_ingredients.EXP = data.EXP;
      add_ingredients.MFG = data.MFG;
      add_ingredients.Raw = raw;
      add_ingredients.NtiPeriod = data.ntPeriod;
      add_ingredients.Type = data.type;
      add_ingredients.Unit = data.Unit;
      return await this.add_ingredientsRepository.save(add_ingredients);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remov(uuid: string) {
    const add_ingredients = await this.add_ingredientsRepository.findOne({
      where: { Adding_ID: uuid },
    });
    return await this.add_ingredientsRepository.remove(add_ingredients);
  }

  async search(searching: string, uuid: string) {
    try {
      const fridge = await this.fridgeRepository.findOne({
        where: { Fridge_ID: uuid },
        relations:["AddIng_name","AddIng_name.Raw"]
      });
      const Ing = fridge.AddIng_name.filter((x) => x.Raw.Nameing.includes(searching))
      const res = Ing.map((x) => x.Raw)
      return res
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
