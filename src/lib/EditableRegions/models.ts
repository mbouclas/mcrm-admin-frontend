import type {IGenericObject} from "../Shared/models/generic";
import type {CustomFieldModel} from "../CustomFields/models/custom-field.model";


export interface IEditableRegionSettings extends IGenericObject {

}
export interface IEditableRegion {
    name: string;
    label: string;
    type: 'group' | 'repeater' | 'executor';
    description: string;
    fields?: (IEditableRegionField)[] | null;
    allowedTypes?: string[] | null;
    regionSettings: IEditableRegionSettings;
    settings: IEditableRegionSettings;
    executor: string;
    metaData?: IGenericObject;
}
export interface IEditableRegionField extends CustomFieldModel{

}
export interface IEditableRegionLayout {
    name: string;
    label: string;
    description: string;
    type: string;
    regions?: (IEditableRegion)[] | null;
}
