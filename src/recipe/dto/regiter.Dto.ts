export class CreateRecipeDto {
  uuidRecipe: string;
  name: string;
  methon: string;
  cooking_time: number;
  ingredients: { Raw_material_ID: string; Amount: number }[];
  category: string[];
  User_ID: string;
}
