import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class MusicsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}
}
