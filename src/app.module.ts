import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MusicsModule } from "./musics/musics.module";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import * as errorsInterceptor from "./common/errors.interceptor";
import { ValidationPipe } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MusicsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: errorsInterceptor.ErrorsInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
