import 'reflect-metadata';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { UserFactory } from './user.factory';
import { MainSeeder } from './main.seeder';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../src/user/entities/user.entity';
import { AppFile } from '../src/file/entity/app-file.entity';
import { City } from '../src/city/entity/city.entity';
dotenv.config({ path: '.env' });
const options: SeederOptions = {
  factories: [UserFactory],
  seeds: [MainSeeder],
};


const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, AppFile , City],
});

ds.initialize().then(async () => {
  await runSeeders(ds, options);
  process.exit();
});
