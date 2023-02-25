import { BaseHttpService } from "./base-http.service";
import { app } from '../stores';

export class BootService extends BaseHttpService {
  async boot() {
    const res = await this.get(`boot`);
    // add the data to the store
    app.update(() => res);
    localStorage.setItem('bootData', JSON.stringify(res));
    return res;
  }
}
