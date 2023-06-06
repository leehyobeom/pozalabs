import { Test } from "@nestjs/testing";
import { MusicsService } from "../../src/musics/musics.service";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { musics_correct_request, samples_response } from "../values";

describe("Musics Unit Test", () => {
  let musicsService: MusicsService;

  const setSampleByTrack = jest.spyOn(
    MusicsService.prototype as any,
    "setSampleByTrack"
  );
  const getQueryString = jest.spyOn(
    MusicsService.prototype as any,
    "getQueryString"
  );
  const getSampleAllPage = jest.spyOn(
    MusicsService.prototype as any,
    "getSampleAllPage"
  );
  const getSampleOnePage = jest.spyOn(
    MusicsService.prototype as any,
    "getSampleOnePage"
  );
  getSampleOnePage.mockReturnValue(samples_response);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
      providers: [MusicsService, ConfigService],
    }).compile();
    musicsService = moduleRef.get<MusicsService>(MusicsService);
  });

  it("musics getSamples() call check", async () => {
    musicsService.getSamples(musics_correct_request);
    expect(setSampleByTrack).toHaveBeenCalled();
    expect(getQueryString).toHaveBeenCalled();
    expect(getSampleAllPage).toHaveBeenCalled();
    expect(getSampleOnePage).toHaveBeenCalled();
  });
});
