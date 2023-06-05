import { Controller, Res, Req, Post, Body } from "@nestjs/common";
import { MusicsService } from "./musics.service";
import { MusicsDto } from "../../libs/types/src/dtos/musics.dto";
import { FieldChecker } from "../common/checker.field";
import { Hateoas } from "@libs/types/interface/error";
import { Request } from "@libs/types/interface/musics";


@Controller()
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @Post("v1/musics")
  getMusics(@Body() musicsDto: MusicsDto, @Res() res, @Req() Req) {
    const fieldChecker = new FieldChecker(musicsDto, {});

    //  console.log(isObjKey<Request>("name", {name: "d"}));
    // const errorMessage: Hateoas = {
    //   status: 400,
    //   errorMessage: "",
    //   errorType: "",
    //   links: [],
    // };
    // throw new ErrorsHateoas(errorMessage);
    return res.json({});
  }
}
