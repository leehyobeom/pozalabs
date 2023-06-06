import { registerDecorator } from "class-validator";

export function IsNumberArrayASC() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsArrayASC",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be ASC`,
      },
      validator: {
        validate(array: number[]) {
          const elements = array.entries();
          for (const [index] of elements) {
            if (!index) continue;
            if (array[index - 1] > array[index]) {
              return false;
            }
          }
          return true;
        },
      },
    });
  };
}
