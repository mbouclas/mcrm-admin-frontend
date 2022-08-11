import type {IGenericObject} from "../Shared/models/generic";
import type {IDynamicFieldConfigBlueprint} from "./types";

export interface IBaseModel {
    uuid?: string;
    slug?: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    fields: IDynamicFieldConfigBlueprint[];
}

export class BaseModel {
    public uuid?: string;
    public slug?: string;
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();
    public verifiedAt?: Date;
    public fields: IDynamicFieldConfigBlueprint[] = [];


    public set(obj: IGenericObject) {
        for (let key in obj) {
            this[key] = obj[key];
        }

        return this;
    }
}
