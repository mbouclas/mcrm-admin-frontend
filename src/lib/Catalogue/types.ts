import type {IGenericObject} from "../Shared/models/generic";

export interface IImportAnalyzerData {
    title: string;
    sku: string;
    description: string;
    price: number;
    properties: {key: string, value: any}[];
    categories: string[];
    image: string;
    [key: string]: any;
}

export interface IImportAnalyzerInvalidRow {
    id: string|number;
    row: number;
    fields: {
        key: string;
        value: string;
    }[];
}

export interface IFileUploadResult {
    file: string;
    mimetype: string;
}

export interface IFileImportUploadResult {
    response: IImportAnalyzerResult;
}

export interface IImportProcessorFieldMap {
    name: string;
    importFieldName: string;
    rename?: boolean;
    required?: boolean;
    type?: 'text'|'number'|'float'|'boolean'|'category'|'property'|'image'|'variantId'|'productId'|'price'|'tag';
    relationships?: string[];//graph rels. If present they must be the ones present on the model
    validations?: Function[],// list of validations to run, each entry is a function
    isSlugFor?: string;
    matchSourceValue?: string;
    matchTargetValue?: string;
    slugifyValue?: boolean;
    priceOnRequestFlag?: string;
    displayUsing?: string;
}

export interface IImportAnalyzerResult {
    data: IImportAnalyzerData[];
    invalidRows: IImportAnalyzerInvalidRow[];
    isInvalid: boolean;
    file: IFileUploadResult
    fieldMap: IImportProcessorFieldMap[];
    validRows: number;
    invalidRowsCount: number;
    skippedRows: number;
    metaData: IGenericObject;
}
