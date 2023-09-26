import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IFileUploadResult} from "../../types";
import {writable} from "svelte/store";
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

    async validate(file: IFileUploadResult, template: string): Promise<IImportStartResult> {
        return await super.post('import/validate', {file, template});
    }

    async start(file: IFileUploadResult, template: string, immediate = false): Promise<IImportStartResult|IBaseProcessResult> {
        return await super.post(`import/start?template=${template}&immediate=${immediate}`, file);
    }

    async getProgress(jobId: number) {
        return await super.get(`import/progress/${jobId}`);
    }

    async backup(isDev = false) {

        if (isDev) {
            return  {
                success: true
            };
        }
        return await super.post(`import/backup`);
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
