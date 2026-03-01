import 'reflect-metadata';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { UserFactory } from './user.factory';
import { MainSeeder } from './main.seeder';
import { AppDataSource } from '../ds';
import { AppFileFactory } from './appFile.factory';
import { PropertyFactory } from './property.factory';
import { AdBannerFactory } from './ad-banner.factory';
import { AboutUsFactory } from './about-us.factory';

export const seederOptions: SeederOptions = {
  factories: [
    UserFactory,
    AppFileFactory,
    PropertyFactory,
    AboutUsFactory,
    AdBannerFactory,
  ],
  seeds: [MainSeeder],
};


export async function seed() {
  let ds = AppDataSource;
  await ds.initialize();
  await runSeeders(AppDataSource, seederOptions);
  await ds.destroy();
  console.log('✅ Seed');
}
