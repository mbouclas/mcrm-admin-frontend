import { BaseHttpService } from '../Shared/base-http.service';

export class UserService extends BaseHttpService {
  async login(username: string, password: string) {
    return await this.get('users');
  }
}
