export interface IBaseNamedModel {
    uuid: string;
    name: string;
}
export interface ICountry extends IBaseNamedModel{
    latitude: number;
    longitude: number;
    formattedAddress?: string;
}

export interface ICity extends IBaseNamedModel{
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
}

export interface IMunicipality extends IBaseNamedModel{
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
}

export interface IStreet extends IBaseNamedModel{
    slug: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
}

export interface IPostCode{
    uuid: string;
    code: string;
}
