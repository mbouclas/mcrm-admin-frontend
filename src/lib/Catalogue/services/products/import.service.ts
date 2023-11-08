import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IFileUploadResult} from "../../types";
import {writable} from "svelte/store";
import type {IGenericObject} from "../../../Shared/models/generic";
export interface IImportStartResult {
    jobId: number;
    success: boolean;
}

export interface IBaseProcessResult {
    success: boolean;
    rowsProcessed: number;
}


export class ImportService extends BaseHttpService {
    uploadUpdates$ = writable(null);

    async validate(file: IFileUploadResult, template: string, templateSettings: IGenericObject = {}): Promise<IImportStartResult> {
        return await super.post('import/validate', {file, template, settings: templateSettings});
    }

    async start(file: IFileUploadResult, template: string, immediate = false, templateSettings: IGenericObject = {}): Promise<IImportStartResult|IBaseProcessResult> {
        return await super.post(`import/start?template=${template}&immediate=${immediate}`, {...file, settings: templateSettings});
    }

    async getProgress(jobId: number) {
        return await super.get(`import/progress/${jobId}`);
    }

    async backup(isDev = false, templateSettings: IGenericObject = {}) {

        if (isDev) {
            return  {
                success: true
            };
        }
        return await super.post(`import/backup`, {settings: templateSettings});
    }

    startUploadUpdatesQuery(jobId: number) {
        let i = 0;
        const interval = setInterval(async () => {
            if (i > 20) {return}
            i++;
            // Query for some updated response
            const res = await this.getProgress(jobId);

            if (!res.state) {
                return;
            }

            //update the subscription
            this.uploadUpdates$.update(state => ({...state, ...res}));
            if (res.state === 'completed') {
                //If we get one cancel the timer
                clearInterval(interval);
            }

        }, 2000);
    }
}
