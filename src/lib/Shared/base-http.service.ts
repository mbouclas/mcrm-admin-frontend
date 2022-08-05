import type { IGenericObject } from './models/generic';
import {AuthService} from "../Auth/auth.service";

export class BaseHttpService {
  protected apiUrl = import.meta.env.VITE_API_URL;

  async get(url: string, queryParams?: IGenericObject) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${AuthService.token()}`);
    headers.append('credentials', 'same-origin');
    headers.append('x-sess-id', AuthService.getSessionId());


    const query =
      queryParams && Object.keys(queryParams).length > 0
        ? this.objectToQueryParams(queryParams)
        : '';
    const res = await fetch(`${this.apiUrl}${url}${query}`, {headers});
    return await res.json();
  }



  async post(url: string, body: IGenericObject = {}, extraHeaders: IGenericObject = {}) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${AuthService.token()}`);
    headers.append('x-sess-id', AuthService.getSessionId());

    Object.keys(extraHeaders).forEach(header => {
      headers.append(header, extraHeaders[header])
    });

    const contentType = headers.get('Content-Type');
    if (!contentType) {
      headers.append('Content-Type', 'application/json');
    }

    const rawResponse = await fetch(`${this.apiUrl}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return await rawResponse.json();
  }

  async patch(url: string, body: IGenericObject = {}, extraHeaders: IGenericObject = {}) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${AuthService.token()}`);
    headers.append('x-sess-id', AuthService.getSessionId());

    const res = await fetch(`${this.apiUrl}${url}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    });
  }

  async delete(url: string) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${AuthService.token()}`);
    headers.append('x-sess-id', AuthService.getSessionId());

    const res = await fetch(`${this.apiUrl}${url}`, {
      method: 'DELETE',
      headers,
    });
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
