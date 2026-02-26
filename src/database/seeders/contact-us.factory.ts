import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { User } from '../../user/entities/user.entity';
import { UserRoleType } from '../../user/entities/user-role.type';
import { ContactUs } from '../../contact_us/entities/contact-us.entity';
import { ContactUsType } from '../../contact_us/entities/contact-us.enum';

export const ContactUsFactory = setSeederFactory(ContactUs, (faker: Faker) => {
  const contactUs = new ContactUs();
  let types = [
    ContactUsType.facebook,
    ContactUsType.instagram,
    ContactUsType.phone,
  ];
  let type = faker.helpers.arrayElement(types);
  let value = '';
  if (type == ContactUsType.phone) {
    value =
      '+963' + faker.number.int({ min: 111111111, max: 999999999 }).toString();
  } else {
    value = faker.internet.url();
  }
  contactUs.type = type;
  contactUs.value = value;
  return contactUs;
});
