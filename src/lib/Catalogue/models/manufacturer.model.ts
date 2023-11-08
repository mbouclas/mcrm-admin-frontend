export class ManufacturerModel {
    public uuid: string;
    public title: string;
    public slug: string;
    public active: boolean;
    public description: string;
    public thumb: string;
    public createdAt: Date;
    public updatedAt: Date;


    constructor(config?: Partial<ManufacturerModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}
