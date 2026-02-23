import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../src/user/entities/user.entity';
import { UserRoleType } from '../src/user/entities/user-role.type';
import { AppFile } from '../src/file/entity/app-file.entity';
import { seedCities } from './city.factory';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    let user = factoryManager.get(User);
    await dataSource.getRepository(User).deleteAll();
    await dataSource.getRepository(AppFile).deleteAll();
    await user.saveMany(20);
    await dataSource.getRepository(User).save({
      name: 'admin',
      email: 'admin@realestate.com',
      password: '$2b$10$zv888SaqkwyknsjxtsQa2uMxbKqdcef.TwCNqS8pxXbclewsqSlEu',
      role: UserRoleType.Admin,
    });
    console.log('Seeded Users');
    await seedCities(dataSource);
  }
}
