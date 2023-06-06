import { Test } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CategoryService } from "../../src/categories/category.service";
import { HttpModule } from "@nestjs/axios";
import { musics_correct_request, categories } from "../values";

describe("Category Unit Test", () => {
  let categoryService: CategoryService;

  const select_field_checker = jest.spyOn(
    CategoryService.prototype as any,
    "select_field_checker"
  );
  const check_array_field = jest.spyOn(
    CategoryService.prototype as any,
    "check_array_field"
  );
  const check_field = jest.spyOn(
    CategoryService.prototype as any,
    "check_field"
  );
  const check_track_field = jest.spyOn(
    CategoryService.prototype as any,
    "check_track_field"
  );
  check_field.mockReturnValue("");

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
      providers: [CategoryService, ConfigService],
    }).compile();
    categoryService = moduleRef.get<CategoryService>(CategoryService);
  });

  it("category service checkCategory() call check", async () => {
    categoryService.checkCategory(musics_correct_request, categories);
    expect(select_field_checker).toHaveBeenCalled();
    expect(check_array_field).toHaveBeenCalled();
    expect(check_field).toHaveBeenCalled();
    expect(check_track_field).toHaveBeenCalled();
  });
});
