import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IFileUploadResult} from "../../types";
import {writable} from "svelte/store";
export interface IImportStartResult {
    jobId: number;
    success: boolean;
}


export class ImportService extends BaseHttpService {
    uploadUpdates$ = writable(null);

    async start(file: IFileUploadResult): Promise<IImportStartResult> {
        return await super.post('import/start', file);
    }

    async getProgress(jobId: number) {
        return await super.get(`import/progress/${jobId}`);
    }

    startUploadUpdatesQuery(jobId: number) {
        let i = 0;
        const interval = setInterval(async () => {
            if (i > 10) {return}
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

        }, 1000);
    }
}
