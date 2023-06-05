import { registerDecorator, ValidationOptions } from "class-validator";

import { Track } from "@libs/types/interface/musics";
export function IsUniquePrimary() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isUniquePrimary",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: "primary must contain no more than 1 elements in tracks",
      },
      validator: {
        validate(tracks: Track[]) {
          return tracks.filter((track) => track.is_primary).length < 2;
        },
      },
    });
  };
}

export function IsNotDrumRolePrimary() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotDrumRolePrimary",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: "drum role must not be primary in tracks",
      },
      validator: {
        validate(tracks: Track[]) {
          return (
            tracks.filter((track) => track.is_primary && track.role === "drums")
              .length === 0
          );
        },
      },
    });
  };
}
