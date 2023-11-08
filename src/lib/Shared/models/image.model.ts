export class ImageModel {
    uuid: string = null;
    url: string;
    caption: string;
    alt: string;
    title: string;
    description: string;

    constructor(config?: Partial<ImageModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}
