import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { ModelModule } from './model/model.module';
import { UserModule } from './user/user.module';
import { RecipeModule } from './recipe/recipe.module';
import { FridgeModule } from './fridge/fridge.module';
import { RawModule } from './raw/raw.module';
import { PlanerModule } from './planer/planer.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ModelModule,
    UserModule,
    RecipeModule,
    FridgeModule,
    RawModule,
    PlanerModule,
    IngredientsModule,
ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'asset'),
        serveRoot: '/files',
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

constructor() {
    console.log(join(__dirname, '..', 'asset'))
  }

}
