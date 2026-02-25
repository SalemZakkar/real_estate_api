import { DataSource } from 'typeorm';
import { City } from '../../city/entity/city.entity';

export const SYRIAN_GOVERNORATES = [
  'دمشق',
  'ريف دمشق',
  'حلب',
  'حمص',
  'حماة',
  'اللاذقية',
  'طرطوس',
  'دير الزور',
  'الحسكة',
  'الرقة',
  'إدلب',
  'درعا',
  'القنيطرة',
  'السويداء',
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

}
