import { Hateoas } from "@libs/types/interface/error";

export class ErrorsHateoas extends Error {
  private readonly errorType;
  private readonly errorMessage;
  private readonly status;
  private readonly links;

  constructor(errorMessage: Hateoas) {
    super(JSON.stringify(errorMessage, null, 4));
    this.status = errorMessage.status;
    this.errorType = errorMessage.errorType;
    this.errorMessage = errorMessage.errorMessage;
    this.links = errorMessage.links;
  }
}
