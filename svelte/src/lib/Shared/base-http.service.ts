import type { IGenericObject } from '../Shared/models/generic';

export class BaseHttpService {
  protected apiUrl = import.meta.env.VITE_API_URL;

  async get(url: string, queryParams?: IGenericObject) {
    const query =
      queryParams && Object.keys(queryParams).length > 0
        ? this.objectToQueryParams(queryParams)
        : '';
    const res = await fetch(`${this.apiUrl}${url}${query}`);
    return await res.json();
  }



  async post(url: string, body: IGenericObject = {}) {
    const rawResponse = await fetch(`${this.apiUrl}${url}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic YWRtaW5BcHA6dG9wU2VjcmV0'
      },
      body: JSON.stringify(body)
    });
    return await rawResponse.json();
  }

  private objectToQueryParams(obj: IGenericObject) {
    return Object.entries(obj)
      .map(
        ([k, v]) =>
          `${k}=${encodeURIComponent(
            typeof v === 'object' ? JSON.stringify(v) : v
          )}`
      )
      .join('&');
  }
}
