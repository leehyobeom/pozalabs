import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MusicsController } from "./musics.controller";
import { MusicsService } from "./musics.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
  ],
  controllers: [MusicsController],
  providers: [MusicsService, ConfigService],
})
export class MusicsModule {}
