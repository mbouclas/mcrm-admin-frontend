import { BaseHttpService } from '../Shared/base-http.service';
import { AuthService } from '../Auth/auth.service';

export class UserService extends BaseHttpService {
  async login(username: string, password: string) {
    return await this.get('users');
  }

  static getUserFromLocalStorage() {
    const userInfoString = localStorage.getItem('user');
    if (!userInfoString) {
      return null;
    }

    return AuthService.currentUser();
  }
}
