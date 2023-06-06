import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
  IsBoolean,
  Max,
  Min,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";
import { Type } from "class-transformer";
import {
  IsUniquePrimary,
  IsNotDrumRolePrimary,
} from "@libs/types/validate/validate.tracks";

import { IsNumberArrayASC } from "@libs/types/validate/validate.common";

export class RequestDto {
  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @Max(200, { each: true })
  @Min(30, { each: true })
  @IsNumberArrayASC()
  bpm: number[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  keys: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  time_signatures: string[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Track)
  @IsUniquePrimary()
  @IsNotDrumRolePrimary()
  tracks: Track[];
}

export class Track {
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString({ each: true })
  instruments: string[];

  @IsNotEmpty()
  @IsBoolean()
  is_primary: boolean;
}
