export interface ITagModel {
    name: string;
    slug: string;
    uuid?: string;
    model: string;
}

export class TagModel {
    name: string;
    slug: string;
    uuid?: string;
    model: string;

    constructor(config?: Partial<TagModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}
