import { DataSource } from 'typeorm';
import { City } from './../src/city/entity/city.entity';

export const SYRIAN_GOVERNORATES = [
  'Damascus',
  'Rif Dimashq',
  'Aleppo',
  'Homs',
  'Hama',
  'Latakia',
  'Tartus',
  'Deir ez-Zor',
  'Al-Hasakah',
  'Ar-Raqqa',
  'Idlib',
  'Daraa',
  'Quneitra',
  'Sweida',
];

export async function seedCities(dataSource: DataSource) {
  const cityRepo = dataSource.getRepository(City);

  for (const name of SYRIAN_GOVERNORATES) {
    const exists = await cityRepo.findOneBy({ name });
    if (!exists) {
      const city = cityRepo.create({ name });
      await cityRepo.save(city);
    }
  }

  console.log('✅ Syrian governorates seeded');
}