import {BaseHttpService} from "../Shared/base-http.service";

export class Area51Service extends BaseHttpService {
    async saveFields(data: any) {
        return await this.post('area51/fields', data);
    }

    async getData() {
        return await this.get('area51/data');
    }
}
