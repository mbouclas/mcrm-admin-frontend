import {z} from "zod";
import type {IGenericObject} from "../../Shared/models/generic";
import {AppService} from "../../Shared/app.service";
import type {ImageModel} from "../../Shared/models/image.model";

export class BusinessCategoryModel {
    uuid: string = null;
    public title: string;
    slug: string;
    public description: string;
    metaData: IGenericObject = {};
    children: BusinessCategoryModel[] = [];
    parentUuid: string = null;
    thumb: Partial<ImageModel> = {};

    static modelSchema =  z.object({
        title: z.string({required_error: 'Title is required', invalid_type_error: 'Title must be a string'}).min(1, 'Title is required'),
        description: z.string({invalid_type_error: 'Description must be a string'}).optional(),
    });

    constructor(config?: Partial<BusinessCategoryModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }

    static getModelFields() {
        return AppService.getModel('BusinessCategoryModel').fields;
    }
}
