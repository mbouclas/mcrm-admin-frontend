import { BaseHttpService } from '../Shared/base-http.service';
export interface IStoredUser {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  client: IClient;
  user: IUser;
}
export interface IClient {
  id: string;
  grants?: string[] | null;
}
export interface IUser {
  lastName: string;
  firstName: string;
  createdAt: string;
  active: boolean;
  uuid: string;
  email: string;
  updatedAt: string;
  role?: IRole[] | null;
  gates?: IGates[] | null;
}
export interface IRole {
  createdAt: string;
  level: number;
  displayName: string;
  name: string;
  description: string;
  uuid: string;
  updatedAt: string;
}
export interface IGates {
  uuid: string;
  gate: string;
  level: string;
  name: string;
  provider: string;
}

export class AuthService extends BaseHttpService {
  static currentUser() {
    let storedUser;
    const storedUserString = localStorage.getItem('user');
    if (!storedUserString) {
      return null;
    }

    return (storedUser = JSON.parse(storedUserString) as IStoredUser);
  }

  static token() {
    return AuthService.currentUser().accessToken;
  }

  static user() {
    return AuthService.currentUser().user;
  }

  static gates() {
    return AuthService.currentUser().user.gates;
  }

  static hasGate(gateName: string) {
    return AuthService.currentUser().user.gates.some((gate) => gate.gate === gateName);
  }

  static roles() {
    return AuthService.currentUser().user.role;
  }

  static storeSessionId(id: string) {
    localStorage.setItem('sessId', id);
  }

  static getSessionId() {
    return localStorage.getItem('sessId');
  }

  static clearSessionId() {
    localStorage.removeItem('sessId');
  }

  async login(username: string, password: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic YWRtaW5BcHA6dG9wU2VjcmV0');
    headers.append('credentials', 'same-origin');

    const urlencoded = new URLSearchParams();
    urlencoded.append('username', username);
    urlencoded.append('password', password);
    urlencoded.append('grant_type', 'password');

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: urlencoded,
    };

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}oauth/token`, requestOptions);

    // const text = await res.text();
    // console.log(await res.json())
    AuthService.storeSessionId(res.headers.get('x-sess-id'));

    return await res.json();
  }

  async logout() {
    const headers = this.getAuthHeaders();

    const requestOptions = {
      method: 'DELETE',
      headers: headers,
    };

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}oauth/logout`, requestOptions);
    AuthService.clearSessionId();
    localStorage.setItem("user", '');
    localStorage.setItem("bootData", '');

  }
}
