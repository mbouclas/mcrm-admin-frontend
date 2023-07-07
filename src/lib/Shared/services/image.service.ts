import {BaseHttpService} from "../base-http.service";

export class ImageService extends BaseHttpService {

    async deleteImage(imageId: string) {
        const res = await super.delete(`image/${imageId}`);
        return res.data;
    }
}
