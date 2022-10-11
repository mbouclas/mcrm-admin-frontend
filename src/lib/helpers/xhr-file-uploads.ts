import {AuthService} from "../Auth/auth.service";
import { writable, readable } from 'svelte/store';
import {BaseHttpService} from "../Shared/base-http.service";

export interface IUploadResponse {
    jobId: string;
    success: boolean;
    url?: string;
}

export interface IFileUploadMetaData {
    module: string;
    type: 'file'|'image';
    id?: string;
}

export interface IFile extends File {
    progress?: number;
    index?: number;
}


export class XhrFileUploads extends BaseHttpService {
    baseUrl = `${import.meta.env.VITE_API_URL}file-uploader`;
    xhr: XMLHttpRequest;
    file: IFile;
    metaData: IFileUploadMetaData;
    subscription;
    uploadUpdates$ = writable(null);



    constructor(file: IFile, metaData: IFileUploadMetaData, baseUrl?: string) {
        super();
        file.progress = 0;
        this.file = file;
        this.metaData = metaData;
        if (baseUrl) {
            this.setBaseUrl(baseUrl);
        }

        this.subscription =  writable({
            response: null,
            progress: 0,
            error: null,
        });

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.subscription.update(state => ({...state, ...{response: JSON.parse(xhr.response)}}));
            }
        };

        xhr.upload.onprogress = (e) => {
            this.subscription.update(state => ({...state, ...{progress: this.calculateProgress(e)}}));
        }

        xhr.upload.onerror = (error) => {
            this.subscription.update(state => ({...state, ...{error}}));
        }

        xhr.open("POST", this.baseUrl, true);

        xhr.setRequestHeader('Authorization', `Bearer ${AuthService.token()}`);
        xhr.setRequestHeader('credentials', 'same-origin');
        xhr.setRequestHeader('x-sess-id', AuthService.getSessionId());

        this.xhr = xhr;
    }

    setBaseUrl(url: string) {
        this.baseUrl = `${import.meta.env.VITE_API_URL}${url}`;
    }

    start() {
        const fd = new FormData();
        fd.append("file", this.file);
        fd.append("metaData", JSON.stringify(this.metaData));

        this.xhr.send(fd);
    }

    calculateProgress(e) {
        this.file.progress = Math.ceil((e.loaded / e.total) * 100)
        return this.file.progress;
    }

    onError(e: any) {
        return e;
    }

    startUploadUpdatesQuery(jobId: string) {
        let i = 0;
        const interval = setInterval(async () => {
            if (i > 10) {return}
            i++;
            // Query for some updated response
            const res = await this.get(`file-uploader/status/${jobId}`);

            if (!res.success) {
                return;

            }

            //update the subscription
            this.uploadUpdates$.update(state => ({...state, ...res}));
            //If we get one cancel the timer
            clearInterval(interval);
        }, 1000);

    }
}
