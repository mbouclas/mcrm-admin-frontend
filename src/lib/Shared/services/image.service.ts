import {BaseHttpService} from "../base-http.service";
import type {IGenericObject} from "../models/generic";

export class ImageService extends BaseHttpService {

    async deleteImage(imageId: string) {
        const res = await super.delete(`image/${imageId}`);
        return res.data;
    }

    async updateImageDetails(imageId: string, details: IGenericObject, model: string, modelId: string) {
        const res = await super.patch(`image/${imageId}/details`, {details, model, modelId});
        return res.data;
    }

    async setImageAsMain(imageId: string, model: string, modelId: string) {
        const res = await super.post(`image/${imageId}/set-main`, {
            model,
            modelId,
        });
        return res.data;
    }

    async updateImagesOrder(images: IGenericObject[], model: string, modelId: string) {
        const res = await super.post(`image/update-order`, {
            images: images.map((image, idx) => ({
                uuid: image.uuid,
                order: idx,
            })),
            model,
            modelId,
        });

        return res.data;
    }
}
