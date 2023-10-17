import type {IGenericObject} from "../Shared/models/generic";
import {BaseModel} from "./base-model";
import type {IZodSchema} from "../helpers/data";

export interface IBaseUploaderSettings {
    usePreviews?: boolean;
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    expandable?: boolean;
    disableClick?: boolean;
    dropLabel?: string;
    id?: string;
    maxFileSize?: number;
    maxNumberOfFiles?: number;
    autoStart?: boolean;
    showTextFields?: boolean;
    showClearAll?: boolean;
    async: boolean;
}
export interface IImageUploaderSettings extends IBaseUploaderSettings{
    imageType: string;
}

export interface IDynamicFieldConfigSettingsBluePrint {

}

export interface IDynamicFieldConfigPasswordSettingsBluePrint extends IDynamicFieldConfigSettingsBluePrint {
    confirmRequired: boolean;
}

export interface IDynamicFieldConfigFileUploadSettingsBluePrint extends IDynamicFieldConfigSettingsBluePrint {
    maxFileSize?: number;
    multiple?: boolean;
    fileLimit?: number;
    accept?: string;
    baseUrl?: string;
}

export interface IDynamicFieldConfigImageSettingsBluePrint extends IDynamicFieldConfigSettingsBluePrint {
    width?: number;
    height?: number;
    quality?: number;
    maxFileSize?: number;
    fileLimit?: number;
    accept?: string;//File accept, same as form accept
    multiple?: boolean;//Select more than one image
    selectFromMediaLibrary?: boolean;//If true, we need to show the library tab
    showPreview?: boolean;//If true, show the uploaded image
    addFromUrl?: boolean;//If true, add a tab to paste a url and retrieve it
    defaultCopy?: string;//Which copy to show on the preview. By default, we show the first on the list
}

interface IDynamicFieldSelectOption {
    label: string;
    value: string|number|boolean|null;
    default?: boolean;
}

interface IDynamicFieldItemSelectorConfig {
    module: string;
    multiple?: boolean;
    slices?: string[];
    tabs?: string[];
    resultDisplayField?: string;// What to show once a value of object was selected
    translatable?: boolean; // If it's a translatable field show default translation
}

export class DynamicFieldOnValueChange extends BaseModel {
    field: IDynamicFieldConfigBlueprint;
    value: any;
}

export interface IDynamicFieldConfigBlueprint<ISettingsType = any> {
    varName: string;
    label: string;
    hint?: string;
    type: string;
    placeholder?: string;
    default?: any;
    translatable?: boolean;
    required?: boolean;
    disabled?: boolean;
    schema?: IZodSchema;
    min?: number;
    max?: number;
    step?: number;
    group?: string;
    order?: number;
    settings?: { //Specific settings
        allowDeSelect?: boolean; //Allow radio button to be de selected Checkbox default to true, radio button default to false
        useValue?: boolean, //If true, object selector will return value property not the whole object (false default)
        options?: { varName: string, label: string, value?: any }[], //Array of options for RadioButtons, Selects etc.
        multiple?: boolean, //Multiple
        confirmRequired?: boolean, //Password confirmation
        virtualScroll?: boolean, //Use virtual scroll - for selects
        fields?: IDynamicFieldConfigBlueprint[], //Fields for composite dynamic field
        mask?: string,
        fieldsPerRow?: number, //Number of dynamic fields per row
        hideEmailToButton?: boolean //Used to hide the mail to button on email forms
        nativeControl?: boolean;
    }
    config?: IImageUploaderSettings| IGenericObject
    options?: IDynamicFieldSelectOption[];
    itemSelectorConfig?: IDynamicFieldItemSelectorConfig;
    imageSettings?: IDynamicFieldConfigImageSettingsBluePrint;
    filterField?: string;
    fieldSettings?: IGenericObject;
    onValueChange?: (DynamicFieldOnValueChange) => void;
    [key: string]: any;
}
export interface IDynamicFieldParamConfigBlueprint {
    type: string;
    label: string;
    required: boolean;
    toSlug: string;
    multilingual: boolean;
}

export interface IDynamicFieldParamBlueprint {
    label: IDynamicFieldConfigBlueprint;
    varName: IDynamicFieldConfigBlueprint;
    placeholder: IDynamicFieldConfigBlueprint;
    description: IDynamicFieldConfigBlueprint;
    default: IDynamicFieldConfigBlueprint;
    required: IDynamicFieldConfigBlueprint;
    translatable: IDynamicFieldConfigBlueprint;
    step: IDynamicFieldConfigBlueprint;
    min: IDynamicFieldConfigBlueprint;
    max: IDynamicFieldConfigBlueprint;
    options: {
        params: IDynamicFieldConfigBlueprint;
        label: IDynamicFieldConfigBlueprint;
        value: IDynamicFieldConfigBlueprint;
    };
}

export interface IDynamicFieldBlueprint {
    label: string;
    type: string;
    params: IDynamicFieldParamBlueprint;
    settings: {[key: string]: IDynamicFieldParamConfigBlueprint};
    config: {[key: string]: IDynamicFieldParamConfigBlueprint};
    editableFields: IDynamicFieldConfigBlueprint[];
}

export interface IDynamicFieldError {
    field: string;
    message: string;
}

export interface IDynamicFieldModelChangeEvent {
    value: any;
    varName: string;
    lang?: string;
}

export interface IItemSelectorDisplayLabel {
    label: string;
    field: string;
    type?: 'text' | 'image' | 'boolean' | 'number' | 'date' | 'money';
    classes?: string;
}

export interface IItemSelectorConfig {
    module?: string;
    apiUrl?: string;
    labelField?: string;
    idField?: string;
    valueField?: string;
    filters?: IGenericObject;
    isTree?: boolean;
    filter?: 'local'|'remote';
    labels?: IItemSelectorDisplayLabel[];
}
