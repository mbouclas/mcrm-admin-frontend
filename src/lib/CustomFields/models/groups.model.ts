import type {IDynamicFieldConfigBlueprint} from "../../DynamicFields/types";
import type {IGenericObject} from "../../Shared/models/generic";

export interface IBaseModelFieldGroup {
    name: string;
    label: string;
    type: 'group' | 'repeater';
    description: string;
    fields?: (string)[] | null;
    groupSettings?: IGenericObject;
    settings?: IGenericObject;
    metaData?: IGenericObject;
}
