export class FieldChecker {
  private readonly targetValue;
  private readonly typesFromApi;

  constructor(
    targetValue: Record<string, any>,
    typesFromApi: Record<string, any>
  ) {
    this.targetValue = targetValue;
    this.typesFromApi = typesFromApi;
  }

  public checkFields<T>() {
    for (const [key, value] of Object.entries(this.targetValue)) {
      FieldChecker.checkField(key, value, this.typesFromApi);
    }
  }


  private static checkField(
    fieldName: string,
    fieldValue: any,
    typesFromApi: Record<string, any>
  ) {
    switch (fieldName) {
      case "bpm":
        FieldChecker.checkBPM(fieldValue);
        break;
      case "track":
        FieldChecker.checkTracks(fieldValue);
        break;
      default:
        FieldChecker.checkTypes(fieldValue, typesFromApi);
        break;
    }
  }

  private static checkTypes(tartgetValue, types) {}

  private static checkBPM(value) {}

  private static checkTracks(value) {}
}
