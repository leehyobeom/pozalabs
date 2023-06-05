import { Injectable, HttpException } from "@nestjs/common";
// import { Controller, Get, Res, Req, Param, UseGuards } from "@nestjs/common";
// import * as dayjs from 'dayjs'
import {
  Category,
  CategoryList,
  CategoryParam,
  array_fields,
} from "@libs/types/interface/category";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { Hateoas } from "@libs/types/interface/error";
import { Track } from "@libs/types/interface/musics";

@Injectable()
export class CategoryService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async getCategory(): Promise<CategoryList> {
    const url = `${this.configService.get("API_HOST")}/categories`;
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

  async checkFieldCategory(
    target: Record<string, any>,
    categoryList: CategoryList
  ) {
    const errorMessages: string[] = [];
    for (const [key, value] of Object.entries(target)) {
      const category_param: CategoryParam = {
        category_type: key,
        value,
        categoryList,
        errorMessages,
      };
      this.check_category(category_param);
    }

    if (errorMessages.length) {
      const hateoas: Hateoas = {
        statusCode: 400,
        message: errorMessages,
        links: [
          {
            name: "getCategory",
            ref: `${this.configService.get("API_HOST")}/categories`,
          },
        ],
      };
      throw new HttpException(hateoas, hateoas.statusCode, {
        cause: new Error(errorMessages.toString()),
      });
    }
    return;
  }

  check_category(categoryParam: CategoryParam) {
    const array_type = array_fields[categoryParam.category_type];
    if (array_type) {
      categoryParam.category_type = array_type;
      this.check_array_fields(categoryParam);
      return;
    }
    if (categoryParam.category_type === "tracks") {
      this.check_track(categoryParam);
      return;
    }
    this.check_field(categoryParam);
  }

  check_array_fields(categoryParam: CategoryParam) {
    for (const value of categoryParam.value) {
      categoryParam.value = value;
      this.check_field(categoryParam);
    }
  }

  check_track(categoryParam: CategoryParam) {
    for (const value of categoryParam.value) {
      categoryParam.category_type = "role";
      categoryParam.value = value.role;
      this.check_field(categoryParam);

      categoryParam.category_type = "instrument";
      categoryParam.value = value.instruments;
      this.check_array_fields(categoryParam);
    }
  }

  check_field(categoryParam: CategoryParam) {
    const category: Category[] = categoryParam.categoryList.items.filter(
      (item) => item.type === categoryParam.category_type
    );
    if (!category?.length) {
      return;
    }
    if (!category.find((item) => item.name === categoryParam.value)) {
      categoryParam.errorMessages.push(
        `${categoryParam.category_type} must be ${category
          .map((item) => item.name)
          .join(", ")} (input: ${categoryParam.value})`
      );
      return;
    }

    return;
  }
}
