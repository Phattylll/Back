import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Planner, Recipe, User } from 'src/entities/index.entity';
import { Repository } from 'typeorm';
import { CreatePlanerDto } from './dto/planer.Dto';

@Injectable()
export class PlanerService {
  constructor(
    @InjectRepository(Planner)
    private readonly plannerRepository: Repository<Planner>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createPlanerDto: CreatePlanerDto) {
    const user = await this.userRepository.findOne({
      where: { User_ID: createPlanerDto.uuidUser },
    });
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: createPlanerDto.uuidrecipe },
    });
    const planner = await this.plannerRepository.findOne({
      where: {
        User: user,
        period: createPlanerDto.period,
        timeAdd: createPlanerDto.timeAdd,
      },
      relations: ['Recipe'],
    });
    console.log(createPlanerDto);

    if (planner) {
      planner.period = createPlanerDto.period;
      planner.timeAdd = createPlanerDto.timeAdd;
      let check = 0;
      for (let index = 0; index < planner.Recipe.length; index++) {
        if (planner.Recipe[index].Recipe_ID == recipe.Recipe_ID) check++;
      }
      if (check == 0) planner.Recipe.push(recipe);

      return await this.plannerRepository.save(planner);
    } else {
      const planner = new Planner();
      planner.CreateTime = new Date();
      planner.period = createPlanerDto.period;
      planner.User = user;
      planner.timeAdd = createPlanerDto.timeAdd;

      planner.Recipe = [recipe];

      return await this.plannerRepository.save(planner);
    }
  }

  async get(sub: string) {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Planner', 'Planner.Recipe'],
    });
    return user.Planner;
  }

  async plannerEdit(createPlanerDto: CreatePlanerDto) {
    const user = await this.userRepository.findOne({
      where: { User_ID: createPlanerDto.uuidUser },
    });
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: createPlanerDto.uuidrecipe },
    });
    const planner = await this.plannerRepository.findOne({
      where: { Planner_ID: createPlanerDto.uuidplanner },
      relations: ['Recipe'],
    });
    console.log(createPlanerDto);
    planner.period = createPlanerDto.period;
    planner.timeAdd = createPlanerDto.timeAdd;
    planner.Recipe = [recipe];
    return await this.plannerRepository.save(planner);
  }

  async remove(uuidplanner: string) {
    const planner = await this.plannerRepository.findOne({
      where: { Planner_ID: uuidplanner },
    });
    await this.plannerRepository.remove(planner);
    return `Delete ${uuidplanner} Success`;
  }
}
