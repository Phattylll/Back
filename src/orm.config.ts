import { TypeOrmModule } from '@nestjs/typeorm';

export const config: TypeOrmModule = {
  type: 'postgres',
  username: process.env.POSTGRES_USER || 'pg',
  password: process.env.POSTGRES_PASSWORD || '28yxrFXLrd6btWtc',
  port: process.env.POSTGRES_PORT || 7503,
  host: process.env.POSTGRES_HOST || '161.246.5.159',
  database: process.env.POSTPOSTGRES_DBGRES_DB || 'chillmeta',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  // logging: true,
};
