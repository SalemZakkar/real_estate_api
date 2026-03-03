import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'or', async: false })
export class OrValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as any;
    const properties: string[] = args.constraints;

    const definedCount = properties.filter(
      (prop) => object[prop] !== undefined && object[prop] !== null,
    ).length;

    return definedCount === 1 || definedCount === 0;
  }

  defaultMessage(args: ValidationArguments) {
    const properties: string[] = args.constraints;
    return `Exactly one of [${properties.join(', ')}] must be provided`;
  }
}
