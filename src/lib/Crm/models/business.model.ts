import type {BusinessCategoryModel} from "./business-category.model";
import type {ImageModel} from "../../Shared/models/image.model";
import type {ITagModel} from "../../Shared/models/tag.model";
import type {ICity, ICountry, IMunicipality, IPostCode} from "./locations";
import type {UserModel} from "../../User/User/models/user.model";
import type {NotesModel} from "./notes.model";
import type {IGenericObject} from "../../Shared/models/generic";

export class BusinessModel {
    title: string;
    slug: string;
    description: string;
    active: boolean;
    uuid: string = null;
    businessCategory: BusinessCategoryModel[] = [];
    thumb: ImageModel;
    images: ImageModel[] = [];
    tag: ITagModel[] = [];
    tradeName: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    country?: ICountry;
    city?: ICity;
    postCode?: IPostCode;
    poBox?: string;
    municipality?: IMunicipality;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    children: BusinessModel[] = [];
    parent: BusinessModel;
    createdBy: UserModel;
    updatedBy: UserModel;
    isVerified: boolean;
    owner: UserModel;
    inIndustrialArea: boolean;
    notes: NotesModel[] = [];
    metaData: IGenericObject = {};

    constructor(config?: Partial<BusinessModel>) {
        if (config) {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    this[key] = config[key];
                }
            }
        }
    }
}
