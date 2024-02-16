import type {IGenericObject} from "../Shared/models/generic";
import {z} from "zod";
import {AppService} from "../Shared/app.service";

export class MenuModel {
    uuid: string = null;
    title: string;
    slug: string;
    description: string;
    caption: string;
    metaData: IGenericObject = {};
    menuItem: MenuItemModel[] = [];

    static modelSchema =  z.object({
        title: z.string({required_error: 'Title is required', invalid_type_error: 'Title must be a string'}).min(1, 'Title is required'),
        description: z.string({required_error: 'Description is required', invalid_type_error: 'Description must be a string'}).min(1, 'Description is required'),
        caption: z.string({ invalid_type_error: 'Caption must be a string'}).optional(),
    });

    constructor(config?: Partial<MenuModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}

export class MenuItemModel {
    uuid: string = null;
    parentUuid: string = null;
    title: string;
    url: string;
    description: string;
    slug: string;
    link: string;
    caption: string;
    permalink: string;
    model: string;
    itemId: string;
    target: '_self'|'_blank' = '_self';
    type: 'custom'|'object' = 'custom';
    metaData: IGenericObject = {};
    order: number;
    children: MenuItemModel[] = [];
    static modelSchema =  z.object({
        title: z.string({required_error: 'Title is required', invalid_type_error: 'Title must be a string'}).min(1, 'Title is required'),
        description: z.string({invalid_type_error: 'Description must be a string'}).optional(),
        caption: z.string({ invalid_type_error: 'Caption must be a string'}).optional(),
    });


    constructor(config?: Partial<MenuItemModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }

    static getModelFields() {
        return AppService.getModel('MenuItemModel').fields;
    }
}

