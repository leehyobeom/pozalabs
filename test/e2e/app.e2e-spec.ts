import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import {
  musics_request_filed_check,
  musics_request_category_check,
  musics_correct_request,
} from "../values";

describe("App E2E Test", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("[POST] /v1/musics (check field)", async () => {
    const test = await request(app.getHttpServer())
      .post("/v1/musics")
      .send(musics_request_filed_check)
      .expect(400);

    expect(test.body.message).toContain(
      "each value in bpm must not be less than 30"
    );
    expect(test.body.message).toContain(
      "each value in bpm must not be greater than 200"
    );
    expect(test.body.message).toContain(
      "bpm must contain no more than 2 elements"
    );
    expect(test.body.message).toContain(
      "drum role must not be primary in tracks"
    );

    expect(test.body.message).toContain(
      "primary must contain no more than 1 elements in tracks"
    );
    expect(test.body.message).toContain("bpm must be ASC");
  });

  it("[POST] /v1/musics (check category)", async () => {
    const test = await request(app.getHttpServer())
      .post("/v1/musics")
      .send(musics_request_category_check)
      .expect(400);

    expect(test.body.message).toContain(
      "instrument must be piano, drums, bass, guitar (input: trumpet)"
    );
    expect(test.body.message).toContain(
      "key must be cmajor, aminor (input: dminor)"
    );

    expect(test.body.message).toContain(
      "time_signature must be 3/4, 4/4, 6/8 (input: 4/8)"
    );
  });

  it("[POST] /v1/musics (check response)", async () => {
    const test = await request(app.getHttpServer())
      .post("/v1/musics")
      .send(musics_correct_request)
      .expect(201);
    expect(test.body).toHaveProperty("total");
    expect(test.body).toHaveProperty("items");

    const item = test.body?.items?.pop();

    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("genre");
    expect(item).toHaveProperty("role");
    expect(item).toHaveProperty("instrument");
    expect(item).toHaveProperty("key");
    expect(item).toHaveProperty("bpm");
  });
});
