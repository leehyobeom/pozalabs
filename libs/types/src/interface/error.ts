import { HttpStatus } from "@nestjs/common";

export interface Hateoas {
  statusCode: HttpStatus;
  error?: string;
  message: string | string[];
  links?: {
    name: string;
    ref: string;
  }[];
}
