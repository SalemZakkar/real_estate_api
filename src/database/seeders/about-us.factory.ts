import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { AboutUs } from '../../about_us/entities/about-us.entity';

export const AboutUsFactory = setSeederFactory(AboutUs, (faker: Faker) => {
  let aboutUs = new AboutUs();
  aboutUs.description = faker.lorem.sentence(100);
  aboutUs.instagramLink = faker.internet.url();
  aboutUs.facebookLink = faker.internet.url();
  aboutUs.privacyPolicy = faker.lorem.sentence(100);
  aboutUs.termsAndConditions = faker.lorem.sentence(100);
  aboutUs.phones = [faker.phone.number(), faker.phone.number(),];
  return aboutUs;
});
