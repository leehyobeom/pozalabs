import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MusicsController } from "./musics.controller";
import { MusicsService } from "./musics.service";
import { CategoryService } from "../categories/category.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get("HTTP_TIMEOUT"),
        maxRedirects: configService.get("HTTP_MAX_REDIRECTS"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MusicsController],
  providers: [MusicsService, CategoryService, ConfigService],
})
export class MusicsModule {}
