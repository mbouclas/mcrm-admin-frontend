import type {IGenericObject} from "../../Shared/models/generic";

export class NotesModel {
    uuid: string = null;
    title: string;
    content: string;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    metaData: IGenericObject = {};
}
