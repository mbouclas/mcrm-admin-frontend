import {BaseHttpService} from "../../../Shared/base-http.service";

export class OrderStatsService extends BaseHttpService {
    async stats(items = ['*'], dates: string[] = [], limit = 5) {
        let qs;
        if (items.length > 0) {
            qs = qs
                ? `${qs}&${items.map((r) => `with[]=${r}`).join('&')}`
                : items.map((r) => `with[]=${r}`).join('&');
        }

        if (dates[0]) {
            qs = qs ? `${qs}&fromDate=${dates[0]}` : `fromDate=${dates[0]}`;
        }

        if (dates[1]) {
            qs = qs ? `${qs}&toDate=${dates[1]}` : `toDate=${dates[1]}`;
        }

        if (limit) {
            qs = qs ? `${qs}&limit=${limit}` : `limit=${limit}`;
        }

        return await this.get(`order-stats${qs ? `?${qs}` : ''}`);
    }

    async load(item = 'salesByDate', dates: string[] = [], limit = 5) {

        let qs;
        if (dates[0]) {
            qs = qs ? `${qs}&fromDate=${dates[0]}` : `fromDate=${dates[0]}`;
        }

        if (dates[1]) {
            qs = qs ? `${qs}&toDate=${dates[1]}` : `toDate=${dates[1]}`;
        }

        if (limit) {
            qs = qs ? `${qs}&limit=${limit}` : `limit=${limit}`;
        }

        return await this.get(`order-stats/load/${item}${qs ? `?${qs}` : ''}`);
    }

    async getAggregateStats() {
        return await this.get(`order-stats/aggregate`);
    }
}
