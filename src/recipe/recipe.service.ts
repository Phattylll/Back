import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/regiter.Dto';
import {
  Ingredients,
  Raw_material,
  Recipe,
  User,
  Rating,
  Add_ingredients,
} from 'src/entities/index.entity';
import { createReadStream } from 'fs';
import { log } from 'console';

@Injectable()
export class RecipeService {

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Raw_material)
    private readonly raw_materialRepository: Repository<Raw_material>,
    @InjectRepository(Ingredients)
    private readonly ingredientsRepository: Repository<Ingredients>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) { }

  async create(createRecipeDto: CreateRecipeDto) {
    const recipe = new Recipe();
    const user = await this.userRepository.findOne({
      where: { User_ID: createRecipeDto.User_ID },
    });
    recipe.Recipe_name = createRecipeDto.name;
    recipe.Category = createRecipeDto.category;
    recipe.Method = createRecipeDto.methon;
    recipe.CookingTime = createRecipeDto.cooking_time;
    recipe.Username_ID = user;
    const recipe2 = await this.recipeRepository.save(recipe);
    for (let index = 0; index < createRecipeDto.ingredients.length; index++) {
      const raw = await this.raw_materialRepository.findOne({
        where: {
          Raw_material_ID: createRecipeDto.ingredients[index].Raw_material_ID,
        },
      });
      const Ingredient = new Ingredients();
      Ingredient.Amount = createRecipeDto.ingredients[index].Amount;
      Ingredient.Raw_material = raw;
      Ingredient.Recipe = recipe2;
      console.log(Ingredient);

      await this.ingredientsRepository.save(Ingredient);
      recipe2.Colorie += (Ingredient.Amount / 100) * raw.Amount;
    }
    return await this.recipeRepository.save(recipe2);
  }
  async EditRecipe(createRecipeDto: CreateRecipeDto) {
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: createRecipeDto.uuidRecipe },
      relations: ['Ingredients'],
    });
    recipe.Recipe_name = createRecipeDto.name;
    recipe.Category = createRecipeDto.category;
    recipe.Method = createRecipeDto.methon;
    recipe.CookingTime = createRecipeDto.cooking_time;
    recipe.Colorie = 0;
    const ingredients = recipe.Ingredients;
    await this.recipeRepository.save(recipe);

    for (let index = 0; index < ingredients.length; index++) {
      await this.ingredientsRepository.remove(recipe.Ingredients[index]);
    }

    const recipe2 = await this.recipeRepository.findOne({
      where: { Recipe_ID: createRecipeDto.uuidRecipe },
    });

    for (let index = 0; index < createRecipeDto.ingredients.length; index++) {
      const raw = await this.raw_materialRepository.findOne({
        where: {
          Raw_material_ID: createRecipeDto.ingredients[index].Raw_material_ID,
        },
      });
      const Ingredient2 = new Ingredients();
      Ingredient2.Amount = createRecipeDto.ingredients[index].Amount;
      Ingredient2.Raw_material = raw;
      Ingredient2.Recipe = recipe2;
      recipe2.Colorie += (Ingredient2.Amount / 100) * raw.Amount;
      await this.ingredientsRepository.save(Ingredient2);
    }

    return await this.recipeRepository.save(recipe2);
  }
  async get() {
    // return await this.recipeRepository.find({  relations: ["Username_ID", "Ingredients", "Ingredients.Raw_material"] });
    const recipe = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.Username_ID', 'user')
      .leftJoinAndSelect('recipe.Ingredients', 'ingredients')
      .leftJoinAndSelect('ingredients.Raw_material', 'raw_material')
      .leftJoinAndSelect('recipe.Ratings', 'Rating')
      .orderBy('RANDOM()') // Order by random to get a random subset
      .limit(20)
      .getMany();
    let res = recipe.map((temp) => {
      let rate = 0;
      temp.Ratings.forEach((x) => {
        rate += x.Rating
      })
      if (temp.Ratings.length != 0)
        rate /= temp.Ratings.length;
      return { "recipe": temp, rate }
    })
    return res
  }

  async img(filePath: string, uuid: string) {
    const url = `${process.cwd()}/${filePath}`;
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: uuid },
    });
    recipe.Image = url;
    return this.recipeRepository.save(recipe);
  }

  async remove(uuid: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: uuid },
      relations: ['Ingredients'],
    });
    for (let index = 0; index < recipe.Ingredients.length; index++) {
      await this.ingredientsRepository.remove(recipe.Ingredients[index]);
    }
    await this.recipeRepository.remove(recipe);
  }

  async getsave(sub: string) {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Save', 'Save.Username_ID'],
    });
    return user.Save;
  }

  async save(sub: string, uuid: string) {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Save'],
    });
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: uuid },
    });

    console.log(user);
    if (user.Save) user.Save.push(recipe);
    else user.Save = [recipe];

    await this.userRepository.save(user);
    return "Successful";
  }

  async UnSave(sub: any, uuid: string) {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Save'],
    });

    user.Save = user.Save.filter((x) => {
      if (x.Recipe_ID != uuid) return x;
    });
    console.log(user);

    await this.userRepository.save(user);
    return "Successful";
  }

  async Rating(sub: any, uuid: string, rating: number) {
    const user = await this.userRepository.findOne({
      where: { User_ID: sub },
      relations: ['Ratings', 'Ratings.Recipe'],
    });
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: uuid },
    });
    const oldRating = user.Ratings.find((x) => x.Recipe.Recipe_ID == uuid);
    console.log(user);

    if (oldRating) {
      oldRating.Rating = rating;
      await this.ratingRepository.save(oldRating);
    } else {
      const tempRating = new Rating();
      tempRating.Rating = rating;
      tempRating.User = user;
      tempRating.Recipe = recipe;
      await this.ratingRepository.save(tempRating);
    }
    return "Successful";
  }

  async getrating(uuid: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: uuid },
      relations: ['Ratings'],
    });
    let sum = 0;
    for (let index = 0; index < recipe.Ratings.length; index++) {
      sum += recipe.Ratings[index].Rating;
    }
    return sum / recipe.Ratings.length;
  }

  async search(searching: string) {
    const recipe = await this.recipeRepository.find({
      where: {
        Recipe_name: ILike(`%${searching || ''}%`),
      },relations: ["Ratings", "Username_ID", "Ingredients", "Ingredients.Raw_material"]
    });
    
    let res = recipe.map((temp) => {
      let rate = 0;
      temp.Ratings.forEach((x) => {
        rate += x.Rating
      })
      if (temp.Ratings.length != 0)
        rate /= temp.Ratings.length;
      return { "recipe": temp, rate }
    })
    console.log(res);

    res.sort((a, b) => b.rate - a.rate);
    return res.slice(0, 20);

  }

  // private shuffleArray(array: any[]): any[] {
  //   // Fisher-Yates shuffle algorithm
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }
  async recommen(sub: string) {
    const user = await this.userRepository.findOne({ where: { User_ID: sub }, relations: ["Fridge", "Fridge.AddIng_name", "Fridge.AddIng_name.Raw"] });
    let My_Ing: Add_ingredients[] = [];
    for (let index = 0; index < user.Fridge.length; index++) {
      My_Ing = [...My_Ing, ...user.Fridge[index].AddIng_name];

    }

    My_Ing.sort((a, b) => {
      const aExpTime = new Date(a.EXP).getTime();
      const bExpTime = new Date(b.EXP).getTime();
      return bExpTime - aExpTime;
    });
    

    let recipe: Recipe[] = [];
    // console.log(My_Ing);
    
    for (let index = 0; index < My_Ing.length; index++) {
      const temp = await this.recipeRepository.find({
        where: {
          Category: ILike(`%${My_Ing[index].Raw.AddIng_name || ''}%`), //Interest
        },
        relations: ["Ratings", "Username_ID", "Ingredients","Ingredients.Raw_material"]
      });
      recipe = [...recipe, ...temp];
    }
    recipe = recipe.filter((ingredient, index, self) =>
      index === self.findIndex((t) => (
        t.Recipe_ID === ingredient.Recipe_ID
      ))
    );
    
    recipe = recipe.filter((x) => {
      for (let index = 0; index < user.Allogre.length; index++) {
        for (let i = 0; i < x.Ingredients.length; i++) {
          //console.log(x.Ingredients[i]);
          if (user.Allogre[index] == x.Ingredients[i].Raw_material.Nameing) return false;
        }
      }
      return true;
    });
    recipe = recipe.filter((x) => {
      for (let index = 0; index < user.Interest.length; index++) {
        for (let i = 0; i < x.Category.length; i++) {
          console.log(user.Interest[index],x.Category[i]);
          
          if (user.Interest[index] == x.Category[i]) return true;
        }
      }
      return false;
    });
    console.log(recipe);
    let res = recipe.map((temp) => {
      let rate = 0;
      temp.Ratings.forEach((x) => {
        rate += x.Rating
      })
      if (temp.Ratings.length != 0)
        rate /= temp.Ratings.length;
      return { "recipe": temp, rate }
    })
    console.log(res);
    return res.slice(0, 20);

  }
  async recommen2(sub: string,Allogre2:string[]) {
    const user = await this.userRepository.findOne({ where: { User_ID: sub }, relations: ["Fridge", "Fridge.AddIng_name", "Fridge.AddIng_name.Raw"] });
    let My_Ing: Add_ingredients[] = [];
    for (let index = 0; index < user.Fridge.length; index++) {
      My_Ing = [...My_Ing, ...user.Fridge[index].AddIng_name];

    }

    My_Ing.sort((a, b) => {
      const aExpTime = new Date(a.EXP).getTime();
      const bExpTime = new Date(b.EXP).getTime();
      return bExpTime - aExpTime;
    });
    

    let recipe: Recipe[] = [];
    // console.log(My_Ing);
    
    for (let index = 0; index < My_Ing.length; index++) {
      const temp = await this.recipeRepository.find({
        where: {
          Category: ILike(`%${My_Ing[index].Raw.AddIng_name || ''}%`), //Interest
        },
        relations: ["Ratings", "Username_ID", "Ingredients","Ingredients.Raw_material"]
      });
      recipe = [...recipe, ...temp];
    }
    recipe = recipe.filter((ingredient, index, self) =>
      index === self.findIndex((t) => (
        t.Recipe_ID === ingredient.Recipe_ID
      ))
    );
    
    recipe = recipe.filter((x) => {
      for (let index = 0; index < Allogre2.length; index++) {
        for (let i = 0; i < x.Ingredients.length; i++) {
          //console.log(x.Ingredients[i]);
          if (Allogre2[index] == x.Ingredients[i].Raw_material.Nameing) return false;
        }
      }
      return true;
    });
    console.log(recipe);
    // recipe = recipe.filter((x) => {
    //   if(user.Interest.length==0)
    //     return true
    //   for (let index = 0; index < user.Interest.length; index++) {
    //     for (let i = 0; i < x.Ingredients.length; i++) {
    //       console.log(user.Interest[index],x.Ingredients[i].Raw_material.Nameing);
          
    //       if (user.Interest[index] == x.Ingredients[i].Raw_material.Nameing) return true;
    //     }
    //   }
    //   return false;
    // });
    recipe = recipe.filter((x) => {
      for (let index = 0; index < user.Interest.length; index++) {
        for (let i = 0; i < x.Category.length; i++) {
          console.log(user.Interest[index],x.Category[i]);
          
          if (user.Interest[index] == x.Category[i]) return true;
        }
      }
      return false;
    });    
    let res = recipe.map((temp) => {
      let rate = 0;
      temp.Ratings.forEach((x) => {
        rate += x.Rating
      })
      if (temp.Ratings.length != 0)
        rate /= temp.Ratings.length;
      return { "recipe": temp, rate }
    })
   
    return res.slice(0, 20);

  }
  // async getpic(sub: any)  {
  //   const recipe = await this.recipeRepository.findOne({
  //     where: { Recipe_ID: sub },
  //   });
  //   const file = createReadStream(recipe.Image);
  //   return new StreamableFile(file);
  // }

  async getpic(sub: any): Promise<import("@nestjs/common").StreamableFile | PromiseLike<import("@nestjs/common").StreamableFile>> {
    const recipe = await this.recipeRepository.findOne({
      where: { Recipe_ID: sub },
    });
    const file = createReadStream(recipe.Image);
    return new StreamableFile(file);
  }

  async Filter(data: { ingredients: string[]; type: string[]; }) {
    let recipe = await this.recipeRepository.find({ relations: ["Ratings", "Username_ID", "Ingredients", "Ingredients.Raw_material"] });
    if (data.ingredients.length)
      recipe = recipe.filter((x) => {
        for (let index_i = 0; index_i < data.ingredients.length; index_i++) {
          for (let index_c = 0; index_c < x.Ingredients.length; index_c++) {
            if (data.ingredients[index_i] == x.Ingredients[index_c].Raw_material.Nameing)
              return true
          }
        }
        return false;
      })
    if (data.type.length)
      recipe = recipe.filter((x) => {
        for (let index_i = 0; index_i < data.type.length; index_i++) {
          for (let index_c = 0; index_c < x.Category.length; index_c++) {
            if (data.type[index_i] == x.Category[index_c])
              return true
          }
        }
        return false;
      })
    let res = recipe.map((temp) => {
      let rate = 0;
      temp.Ratings.forEach((x) => {
        rate += x.Rating
      })
      if (temp.Ratings.length != 0)
        rate /= temp.Ratings.length;
      return { "recipe": temp, rate }
    })
    console.log(res);

    res.sort((a, b) => b.rate - a.rate);
    return res.slice(0, 20);
  }
}
