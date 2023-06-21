import type { IGenericObject } from "./models/generic";
import { AuthService } from "../Auth/auth.service";
import queryString from "query-string";

export class BaseHttpService {
  protected apiUrl = import.meta.env.VITE_API_URL;

  getApiUrl() {
    return this.apiUrl;
  }

  getAuthHeaders() {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${AuthService.token()}`);
    headers.append("credentials", "same-origin");
    headers.append("x-sess-id", AuthService.getSessionId());

    return headers;
  }

  async get(url: string, queryParams?: IGenericObject) {
    const headers = this.getAuthHeaders();

    const query =
      queryParams && Object.keys(queryParams).length > 0
        ? `?${this.objectToQueryParams(queryParams)}`
        : "";
    const res = await fetch(`${this.apiUrl}${url}${query}`, { headers });
    return await res.json();
  }

  async post(
    url: string,
    body: IGenericObject = {},
    extraHeaders: IGenericObject = {}
  ) {
    try {
      const headers = this.getAuthHeaders();

      Object.keys(extraHeaders).forEach((header) => {
        headers.append(header, extraHeaders[header]);
      });

      const contentType = headers.get("Content-Type");
      if (!contentType) {
        headers.append("Content-Type", "application/json");
      }

      const rawResponse = await fetch(`${this.apiUrl}${url}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!rawResponse.ok) {
        throw new Error("Bad request");
      }
      const res = await rawResponse.json();
      if (typeof res.success !== undefined && !res.success) {
        throw res;
      }
      return res;
    } catch (err) {
      throw err;
    }
  }

  async patch(
    url: string,
    body: IGenericObject = {},
    extraHeaders: IGenericObject = {}
  ) {
    try {
      const headers = this.getAuthHeaders();

      Object.keys(extraHeaders).forEach((header) => {
        headers.append(header, extraHeaders[header]);
      });

      const contentType = headers.get("Content-Type");
      if (!contentType) {
        headers.append("Content-Type", "application/json");
      }

      const rawResponse = await fetch(`${this.apiUrl}${url}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });
      if (!rawResponse.ok) {
        throw new Error("Bad request");
      }
      const res = await rawResponse.json();
      if (typeof res.success !== undefined && !res.success) {
        throw res;
      }
      return res;
    } catch (err) {
      throw err;
    }
  }

  async delete(url: string) {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${AuthService.token()}`);
      headers.append("x-sess-id", AuthService.getSessionId());

      const contentType = headers.get("Content-Type");
      if (!contentType) {
        headers.append("Content-Type", "application/json");
      }

      const rawResponse = await fetch(`${this.apiUrl}${url}`, {
        method: "DELETE",
        headers,
      });
      if (!rawResponse.ok) {
        throw new Error("Bad request");
      }
      const res = await rawResponse.json();
      if (typeof res.success !== undefined && !res.success) {
        throw res;
      }
      return res;
    } catch (err) {
      throw err;
    }
  }

  private objectToQueryParams(obj: IGenericObject) {
    return Object.entries(obj)
      .map(
        ([k, v]) =>
          `${k}=${encodeURIComponent(
            typeof v === "object" ? JSON.stringify(v) : v
          )}`
      )
      .join("&");
  }

  getGridPaginationObject(limit = 10) {
    return {
      enabled: true,
      limit,
      server: {
        url: (prev, page, limit) => {
          return `${prev}${prev.includes("?") ? "&" : "?"}limit=${limit}&page=${
            page + 1
          }`;
        },
      },
    };
  }

  getGridSearchObject() {
    return {
      server: {
        url: (prev, keyword) => {
          return `${prev}${prev.includes("?") ? "&" : "?"}q=${keyword}`;
        },
      },
    };
  }

  getGridSortObject(cols = [{ id: "title", idx: 0 }]) {
    return {
      multiColumn: false,
      server: {
        url: (prev, columns) => {
          if (!columns.length) return prev;
          const col = columns[0];
          const dir = col.direction === 1 ? "asc" : "desc";
          let colName = cols.find((c) => c.idx === col.index).id;

          return `${prev}${
            prev.includes("?") ? "&" : "?"
          }orderBy=${colName}&way=${dir}`;
        },
      },
    };
  }

  generateUrlForList(endpoint: string, filters: IGenericObject = {}) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    return `${this.apiUrl}${endpoint}${qs ? `?${qs}` : ""}`;
  }

  getGridUrl(endpoint: string, filters = {}, thenFunction: Function) {
    return {
      url: this.generateUrlForList(endpoint, filters),
      headers: this.getAuthHeaders(),
      then: thenFunction.bind(this),
      total: (data) => data.total,
    };
  }
}
