import {BaseHttpService} from "../base-http.service";
import {setNotificationAction} from "../../stores";
import type {ITagModel} from "../models/tag.model";

export class TagService extends BaseHttpService {

    async getTags(model: string) {
        const res = await super.get(`tag?model=${model}&limit=1000`);
        return res.data;
    }

    async store(name: string, model: string) {
        try {
            const res = await super.post('tag', {name, model});
            setNotificationAction({
                message: 'Created successfully',
                type: 'success',
            });
            return res;
        } catch (err) {
            setNotificationAction({
                message: 'Failed to create',
                type: 'error',
            });
        }
    }

    async attachToModel(model: string, modelId: string, tag: ITagModel) {
        try {
            const res = await super.post(`tag/attach/${modelId}`, tag);
            setNotificationAction({
                message: 'Saved successfully',
                type: 'success',
            });
            return res;
        } catch (err) {
            setNotificationAction({
                message: 'Failed to save',
                type: 'error',
            });
        }
    }

    async detachFromModel(model: string, modelId: string, tag: ITagModel) {
        try {
            const res = await super.post(`tag/detach/${modelId}`, tag);
            setNotificationAction({
                message: 'Saved successfully',
                type: 'success',
            });
            return res;
        } catch (err) {
            setNotificationAction({
                message: 'Failed to save',
                type: 'error',
            });
        }
    }
}
