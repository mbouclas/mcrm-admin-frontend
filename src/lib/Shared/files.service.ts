import { BaseHttpService } from "./base-http.service";
import type { IGenericObject } from "./models/generic";
import queryString from "query-string";
import { html } from "gridjs";

export class FileService extends BaseHttpService {
  async getFile(filename: string) {
    return await this.get(`files/get?filename=${filename}`);
  }
}
