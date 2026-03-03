import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { User } from '../../user/entities/user.entity';
import { AppFile } from '../../file/entity/app-file.entity';
import { AppDataSource } from '../../database/ds';
import { Property } from '../../property/entites/property.entity';
import {
  PropertyCategory,
  PropertyDeedType,
  PropertyStatus,
  PropertyType,
} from '../../property/entites/property.enum';
import { City } from '../../city/entity/city.entity';
import { basename, join } from 'path';
import * as fs from 'fs/promises';

const seedPath = join(process.cwd(), 'src', 'database', 'seeders', 'files');
const basePath = join(process.env.FILE_STORE!, 'seeds');

const seedFiles = Array.from({ length: 10 }, (_, i) =>
  join(seedPath, `${i + 1}.jpg`),
);

let files: string[] = [];

export const PropertyFactory = setSeederFactory(
  Property,
  async (faker: Faker) => {
    for (const p of seedFiles) {
      let name = basename(p);
      let dest = join(basePath, name);
      await fs.mkdir(basePath, { recursive: true });

      try {
        await fs.copyFile(p, dest);
        files.push(dest);
      } catch (e) {}
    }
    const property = new Property();

    // Random price, size, rooms
    property.price = faker.number.int({ min: 50000, max: 500000 });
    property.size = faker.number.int({ min: 50, max: 500 });
    property.room = faker.number.int({ min: 1, max: 10 });
    property.bathrooms = faker.number.int({ min: 1, max: 5 });
    property.floor = faker.number.int({ min: 1, max: 20 });
    property.neighborhood = faker.location.streetAddress();

    // Random property type / category / deed / status
    property.propertyType = faker.helpers.arrayElement(
      Object.values(PropertyType),
    );
    property.category = faker.helpers.arrayElement(
      Object.values(PropertyCategory),
    );
    property.propertyDeedType = faker.helpers.arrayElement(
      Object.values(PropertyDeedType),
    );
    property.status = faker.helpers.arrayElement(Object.values(PropertyStatus));

    const userRepo = AppDataSource.getRepository(User);
    const fileRepo = AppDataSource.getRepository(AppFile);
    const users = await userRepo.find();
    property.owner = faker.helpers.arrayElement(users);

    // const files = await fileRepo.find(); // all available files
    // const shuffled = faker.helpers.shuffle(files);

    property.images = await fileRepo.save(
      await faker.helpers
        .arrayElements(files, 3)
        .map((e) => ({ path: e, type: 'image/jpeg' })),
    );
    // property.cover = property.images[0];
    const cityRepo = AppDataSource.getRepository(City);
    const cities = await cityRepo.find();
    property.city = faker.helpers.arrayElement(cities);
    const lat = faker.number.float({
      min: 34.7,
      max: 35.2,
      fractionDigits: 5,
    });

    const lng = faker.number.float({
      min: 36.45,
      max: 37.05,
      fractionDigits: 5,
    });

    property.coordinates = {
      coordinates: [lng, lat],
      type: 'Point',
    };
    return property;
  },
);
