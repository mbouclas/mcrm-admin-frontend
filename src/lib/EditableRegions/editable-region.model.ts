import type {IEditableRegion, IEditableRegionField} from "./models";
import type {IGenericObject} from "../Shared/models/generic";

export class EditableRegionModel implements IEditableRegion {
    public name: string;
    public label: string;
    public type: 'group' | 'repeater' | 'executor';
    public description: string;
    public fields: IEditableRegionField[] = [];
    public allowedTypes: string[] = [];
    public settings: IGenericObject = {};
    public regionSettings: IGenericObject = {};
    public executor: string;
    public metaData?: IGenericObject = {};

    constructor(config?: IEditableRegion) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}
