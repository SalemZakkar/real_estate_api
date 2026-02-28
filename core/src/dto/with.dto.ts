import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'with', async: false })
export class WithValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    if (_ !== undefined && _ !== null) {
      return false;
    }
    const object = args.object as any;
    const properties: string[] = args.constraints;

    const definedCount = properties.filter(
      (prop) => object[prop] !== undefined && object[prop] !== null,
    ).length;

    return definedCount === properties.length || definedCount === 0;
  }

  defaultMessage(args: ValidationArguments) {
    const properties: string[] = args.constraints;
    const value = (args.object as any)[args.property];
    if (value !== undefined && value !== null) {
      return `"${args.property}" is not allowed`;
    }
    return `Exactly one of [${properties.join(', ')}] must be provided`;
  }
}
