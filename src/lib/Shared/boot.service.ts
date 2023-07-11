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

    if (Array.isArray(res.configs.store.orderStatuses)) {
      res.configs.store.orderStatuses = res.configs.store.orderStatuses.map((status) => {
        let color = 'gray';
        switch (status.id) {
          case 1: color = 'gray'; break;
          case 2: color = 'blue'; break;
          case 3: color = 'black'; break;
          case 4: color = 'orange'; break;
          case 5: color = 'indigo'; break;
          case 6: color = 'green'; break;
          case 7: color = 'purple'; break;
          case 8: color = 'red'; break;
        }
        return {
          ...status,
          ...{color}
        }
      });
    }

    app.update(() => res);
    localStorage.setItem('bootData', JSON.stringify(res));
    return res;
  }
}
