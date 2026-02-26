import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { AdBanner } from '../../adbanner/entities/ad-banner.entity';
import { basename, join } from 'path';
import * as fs from 'fs/promises';
import { AppDataSource } from '../ds';
import { AppFile } from '../../file/entity/app-file.entity';

const seedPath = join(process.cwd(), 'src', 'database', 'seeders', 'files');
const basePath = join(process.env.FILE_STORE!, 'seeds');

const seedFiles = Array.from({ length: 10 }, (_, i) =>
  join(seedPath, `${i + 1}.jpg`),
);
let files: string[] = [];

export const AdBannerFactory = setSeederFactory(
  AdBanner,
  async (faker: Faker) => {
    const fileRepo = AppDataSource.getRepository(AppFile);

    const adBanner = new AdBanner();
    adBanner.url = faker.internet.url();
    for (const p of seedFiles) {
      let name = basename(p);
      let dest = join(basePath, name);
      await fs.mkdir(basePath, { recursive: true });

      try {
        await fs.copyFile(p, dest);
        files.push(dest);
      } catch (e) {}
    }
    adBanner.image = await fileRepo.save({
      path: faker.helpers.arrayElement(files),
      type: 'image/jpeg',
    });
    return adBanner;
  },
);
