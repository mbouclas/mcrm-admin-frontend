
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

export interface IImportAnalyzerResult {
    data: IImportAnalyzerData[];
    invalidRows: IImportAnalyzerInvalidRow[];
    isInvalid: boolean;
    file: IFileUploadResult
}
