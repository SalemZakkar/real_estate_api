import { setSeederFactory } from 'typeorm-extension';
import { fa, Faker, ne } from '@faker-js/faker';
import { User } from '../src/user/entities/user.entity';
import { UserRoleType } from '../src/user/entities/user-role.type';

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.role = UserRoleType.User;
  user.phone =
    '+963' + faker.number.int({ min: 111111111, max: 999999999 }).toString();
  return user;
});
