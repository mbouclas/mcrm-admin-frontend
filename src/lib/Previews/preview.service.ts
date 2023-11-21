import {BaseHttpService} from "../Shared/base-http.service";

export class PreviewService extends BaseHttpService {
    async generatePreviewUrl(module: string, itemId: string) {
        return await this.get(`previews/generatePreviewUrl/${module}/${itemId}`)
    }

    async dumpData() {
        return await super.get(`previews/dumpData`)
    }
}
