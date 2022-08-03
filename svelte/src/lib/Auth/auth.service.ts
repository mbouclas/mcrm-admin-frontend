import { BaseHttpService } from "../Shared/base-http.service";
import type { IGenericObject } from '../Shared/models/generic';

export class AuthService extends BaseHttpService {
    async login(username: string, password: string) {
        return await this.post('oauth/token', {
            username,
            password
        });
    }
}