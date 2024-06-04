import type {ImageModel} from "../../Shared/models/image.model";

export class PropertyModel {
    public uuid: string;
    public title: string;
    public description: string;
    public slug: string;
    public image: string;
    public type: 'color'|'text';

    constructor(config?: Partial<PropertyModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}

export class PropertyValueModel {
    public uuid: string;
    public name: string;
    public slug: string;
    public image: Partial<ImageModel>|string;
    public color: string;
    public code: string;

    constructor(config?: Partial<PropertyValueModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}
