import { ValidationPipe } from "@nestjs/common";
import * as core from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await core.NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8000);
}
bootstrap();
