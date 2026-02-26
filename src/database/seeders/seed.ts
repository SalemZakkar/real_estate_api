import 'reflect-metadata';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { UserFactory } from './user.factory';
import { MainSeeder } from './main.seeder';
import { AppDataSource } from '../ds';
import { AppFileFactory } from './appFile.factory';
import { PropertyFactory } from './property.factory';
import { ContactUsFactory } from './contact-us.factory';
import { AdBannerFactory } from './ad-banner.factory';

const options: SeederOptions = {
  factories: [UserFactory, AppFileFactory, PropertyFactory, ContactUsFactory , AdBannerFactory],
  seeds: [MainSeeder],
};

AppDataSource.initialize().then(async () => {
  await runSeeders(AppDataSource, options);
  console.log('✅ Seed');

  process.exit();
});
