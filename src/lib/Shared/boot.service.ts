import { BaseHttpService } from "./base-http.service";
import {app} from '../stores';
import type {IAppState} from '../stores';

export class BootService extends BaseHttpService {
  async boot() {
    const res = await this.get(`boot`) as IAppState;
    // add the data to the store
    if (res.configs && res.configs.editableRegions && res.configs.editableRegions['editableRegions']) {
      res.configs.editableRegions = res.configs.editableRegions['editableRegions'];
    }

    app.update(() => res);
    localStorage.setItem('bootData', JSON.stringify(res));
    return res;
  }
}
