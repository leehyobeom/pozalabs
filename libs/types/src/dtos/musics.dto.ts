import { PickType } from "@nestjs/mapped-types";

import { RequestDto } from "./request.dto";
export class MusicsDto extends PickType(RequestDto, [
  "genre",
  "bpm",
  "keys",
  "time_signatures",
  "tracks",
] as const) {}
