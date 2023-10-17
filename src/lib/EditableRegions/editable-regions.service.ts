import {BaseHttpService} from "../Shared/base-http.service";
import {get} from "svelte/store";
import {app, setNotificationAction} from "../stores";
import {find} from "lodash";
import type {IGenericObject} from "../Shared/models/generic";
import type {IEditableRegionLayout} from "./models";
import {BootService} from "../Shared/boot.service";

export interface IEditableRegionType {
    name: string;
    label: string;
    description: string;
}
export const editableRegionTypes: IEditableRegionType[] = [
    {
        name: 'group',
        label: 'Group',
        description: 'Group fields together',
    },
    {
        name: 'repeater',
        label: 'Repeater',
        description: 'Repeat a group of fields',
    },
    {
        name: 'executor',
        label: 'Executor',
        description: 'Execute a predefined function',
    }
];

export class EditableRegionsService extends BaseHttpService {
    static getLayout(filters: IGenericObject) {
        return find(get(app).configs.editableRegions, filters) as IEditableRegionLayout;
    }

    static getLayouts() {
        return get(app).configs.editableRegions as IEditableRegionLayout[];
    }

    static getRegionTypes() {
        return editableRegionTypes;
    }

    static getLayoutType(filters: IGenericObject) {
        return find(editableRegionTypes, filters);
    }

    static getRegion(layoutName: string, regionId: string) {
        const layout = this.getLayout({name: layoutName});
        return find(layout.regions, {name: regionId});
    }

    async getExecutors() {
        const res = await this.get('editable-region/executors');

        return res;
    }

    async getExecutor(id: string) {
        const executors = await this.getExecutors();
        const found = executors.find(e => e.id === id);
        if (!found) {
            return null;
        }

        return found;
    }

    async saveLayout(layout: IEditableRegionLayout) {
        const res = await this.post('editable-region/layout', layout);
        await new BootService().boot();
        setNotificationAction({
            message: 'Saved successfully',
            type: 'success',
        });
        return res;
    }

    async findOne(layoutName: string, regionId: string) {
        const res = await this.get(`editable-region/${layoutName}/${regionId}`);
        if (typeof res.success === 'boolean' && res.success === false) {
            return null;
        }

        return res;
    }

    async saveRegion(layoutName: string, regionId: string, data: IGenericObject) {
        await this.post(`editable-region/${layoutName}/${regionId}`, data, {successMessage: 'Saved successfully'});
    }
}
