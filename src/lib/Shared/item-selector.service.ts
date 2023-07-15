import {BaseHttpService} from "./base-http.service";
import type {IGenericObject, IPagination} from "./models/generic";
import queryString from "query-string";
import {filterInFields, flattenTree} from "../helpers/data";

export class ItemSelectorService extends BaseHttpService {
    constructor(protected baseUrl: string) {
    super();
  }

  async find(filters: IGenericObject = {}, relationships: string[] = []) {
      let qs;
      if (Object.keys(filters).length > 0) {
          qs = queryString.stringify(filters);
      }

      if (relationships.length > 0) {
          qs = qs ? `${qs}&with[]=${relationships.join(",")}` : `with[]=${relationships.join(",")}`;
      }

      const res = await this.get(`${this.baseUrl}${qs ? `?${qs}` : ""}`);
      if (res.data) {
          return res;
      }

      if (Array.isArray(res)) {
          return {
              data: res,
              total: res.length,
          }
      }
  }

    localFilter(items: IPagination<any>, query: string, isTree = false) {
        let dataSet = items.data;
        if (isTree) {
            dataSet = flattenTree(dataSet);
        }

        return filterInFields(query, dataSet, ["name", "title", "description"]);
    }
}
