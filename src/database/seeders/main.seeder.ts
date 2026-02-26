import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../user/entities/user.entity';
import { UserRoleType } from '../../user/entities/user-role.type';
import { AppFile } from '../../file/entity/app-file.entity';
import { Property } from '../../property/entites/property.entity';
import { seedCities } from './city.factory';
import { City } from '../../city/entity/city.entity';
import { ContactUs } from '../../contact_us/entities/contact-us.entity';
import { AdBanner } from '../../adbanner/entities/ad-banner.entity';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await dataSource.getRepository(Property).deleteAll();
    await dataSource.getRepository(User).deleteAll();
    await dataSource.getRepository(AppFile).deleteAll();
    await dataSource.getRepository(City).deleteAll();
    await dataSource.getRepository(ContactUs).deleteAll();
    await dataSource.getRepository(AdBanner).deleteAll();
    await factoryManager.get(User).saveMany(20);
    await dataSource.getRepository(User).save({
      name: 'admin',
      email: 'admin@realestate.com',
      password: '$2b$10$zv888SaqkwyknsjxtsQa2uMxbKqdcef.TwCNqS8pxXbclewsqSlEu',
      role: UserRoleType.Admin,
    });
    await dataSource.getRepository(User).save({
      name: 'Salem Zakkar',
      phone: '+963949123587',
      role: UserRoleType.User,
    });
    await seedCities(dataSource);
    await factoryManager.get(Property).saveMany(13);
    await factoryManager.get(ContactUs).saveMany(13);
    await factoryManager.get(AdBanner).saveMany(13);
  }
}
