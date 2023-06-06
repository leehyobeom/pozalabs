import { Injectable, HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { Hateoas } from "@libs/types/interface/error";
import { SampleList, Response, Track } from "@libs/types/interface/musics";
import { MusicsDto } from "../../libs/types/src/dtos/musics.dto";
@Injectable()
export class MusicsService {
  private readonly per_page: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.per_page = this.configService.get("API_PER_PAGE");
  }

  async getSamples(musics: MusicsDto): Promise<Response> {
    const result: Response = {
      total: 0,
      items: [],
    };

    const primary_track: Track = musics.tracks.find(
      (track) => track.is_primary
    );
    if (primary_track) {
      await this.setSampleByTrack(musics, primary_track, result);
    }

    const tracks: Track[] = musics.tracks.filter((track) => !track.is_primary);
    for (const track of tracks) {
      await this.setSampleByTrack(musics, track, result);
    }

    return result;
  }

  private async setSampleByTrack(
    musics: MusicsDto,
    track: Track,
    response: Response
  ): Promise<void> {
    const query = this.getQueryString(musics, track.role);
    const primary_sample: SampleList = await this.getSampleAllPage(query);
    response.total = response.total + primary_sample.total;
    response.items.push(...primary_sample.items);
  }

  private getQueryString(musics: MusicsDto, role: string): string {
    const query = new URLSearchParams();
    query.append("genre", musics.genre);

    if (role !== "drums") {
      for (const key of musics.keys) {
        query.append("key", key);
      }
    }

    for (const time_signature of musics.time_signatures) {
      query.append("time_signature", time_signature);
    }

    if (musics.bpm.length === 2) {
      query.append("min_bpm", String(musics.bpm[0]));
      query.append("max_bpm", String(musics.bpm[1]));
    } else {
      query.append("min_bpm", String(musics.bpm[0]));
      query.append("max_bpm", String(musics.bpm[0]));
    }

    query.append("role", role);
    return query.toString();
  }

  private async getSampleAllPage(querystring: string): Promise<SampleList> {
    const result: SampleList = await this.getSampleOnePage(querystring);
    const totalPage = Math.ceil(result.total / this.per_page);
    if (totalPage < 2) {
      return result;
    }
    for (const x of Array(totalPage - 1).keys()) {
      const pageResult: SampleList = await this.getSampleOnePage(
        querystring,
        x + 2
      );
      result.items.push(...pageResult.items);
      if (!pageResult.has_next) break;
    }
    return result;
  }

  private async getSampleOnePage(
    querystring: string,
    page = 1
  ): Promise<SampleList> {
    const url = `${this.configService.get(
      "API_HOST"
    )}/samples?${querystring}&page=${page}&per_page=${this.per_page}`;
    try {
      return (await this.httpService.axiosRef(url)).data;
    } catch (error) {
      const hateoas: Hateoas = {
        statusCode: error?.response?.status,
        message: error?.response?.data,
        links: [
          {
            name: "getCategory",
            ref: url,
          },
        ],
      };
      throw new HttpException(hateoas, hateoas.statusCode, {
        cause: new Error(error),
      });
    }
  }
}
