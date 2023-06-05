import { HttpStatus } from "@nestjs/common";

export interface Hateoas {
  status: HttpStatus;
  errorType: string;
  errorMessage: string | Record<string, string>;
  links: {
    name: string;
    ref: string;
  }[];
}
