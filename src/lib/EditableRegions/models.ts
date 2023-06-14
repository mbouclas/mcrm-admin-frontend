import type {IGenericObject} from "../Shared/models/generic";

export interface RootObject {
    name: string;
    label: string;
    regions?: (Regions)[] | null;
}

export interface IEditableRegionSettings extends IGenericObject {

}
export interface Regions {
    name: string;
    label: string;
    type: string;
    fields?: (Fields)[] | null;
    allow?: string[] | null;
    regionSettings: IEditableRegionSettings;
    executor: string;
}
export interface Fields {
    varName: string;
    label: string;
    type: string;
    fields?: (Fields)[] | null;
    allow?: (string)[] | null;
    reconstructModels: boolean;
}
export interface IEditableRegion {
    name: string;
    label: string;
    regions?: (Regions)[] | null;
}
