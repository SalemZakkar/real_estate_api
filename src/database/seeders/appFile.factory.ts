import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { AppFile } from '../../file/entity/app-file.entity';
import { join } from 'path';

const basePath = join(process.cwd(), 'src', 'database', 'seeders', 'files');

const files = Array.from({ length: 10 }, (_, i) => `${i + 1}.jpg`);

export const AppFileFactory = setSeederFactory(AppFile, (faker: Faker) => {
  const appFile = new AppFile();

  const randomFile = faker.helpers.arrayElement(files);

  appFile.path = join(basePath, randomFile);

  appFile.type = 'image/jpg';

  appFile.createdAt = faker.date.past();

  return appFile;
});
