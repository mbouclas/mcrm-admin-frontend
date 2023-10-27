import {BaseHttpService} from "../../../Shared/base-http.service";

export class OrderStatsService extends BaseHttpService {
    async stats(items = ['*']) {
        let qs;
        if (items.length > 0) {
            qs = qs
                ? `${qs}&${items.map((r) => `with[]=${r}`).join('&')}`
                : items.map((r) => `with[]=${r}`).join('&');
        }

        return await this.get(`order-stats${qs ? `?${qs}` : ''}`);
    }

    async getAggregateStats() {
        return await this.get(`order-stats/aggregate`);
    }
}
