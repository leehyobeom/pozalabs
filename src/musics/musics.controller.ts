import { Controller, Res, Req, Post, Body } from "@nestjs/common";
import { MusicsService } from "./musics.service";
import { CategoryService } from "../categories/category.service";
import { MusicsDto } from "../../libs/types/src/dtos/musics.dto";
import { Category, CategoryList } from "@libs/types/interface/category";

@Controller()
export class MusicsController {
  constructor(
    private readonly musicsService: MusicsService,
    private readonly categoryService: CategoryService
  ) {}

  @Post("v1/musics")
  async getMusics(@Body() musicsDto: MusicsDto, @Res() res, @Req() Req) {
    const result: CategoryList = await this.categoryService.getCategory();
    await this.categoryService.checkCategory(musicsDto, result);
    res.send(await this.musicsService.getSamples(musicsDto));
  }
}
