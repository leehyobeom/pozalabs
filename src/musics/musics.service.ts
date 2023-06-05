import { Injectable } from "@nestjs/common";
// import { Controller, Get, Res, Req, Param, UseGuards } from "@nestjs/common";
// import * as dayjs from 'dayjs'

import { ConfigService } from "@nestjs/config";

@Injectable()
export class MusicsService {
  constructor(private readonly config: ConfigService) {}
}
