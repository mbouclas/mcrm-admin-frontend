import {BaseHttpService} from "../base-http.service";

export class FileService extends BaseHttpService {
    async getFileFromOss(bucket: string, filename: string) {
        return await super.get(`files/download/${bucket}/${filename}`);
    }

    async stream(filename: string, contents: boolean = false) {
        const headers = this.getAuthHeaders();
        const res = await fetch(`${this.apiUrl}files/stream?filename=${filename}`, { headers });

                    const blob = await res.blob();

            console.log(blob)
            const mimeType = blob.type;
            return new File([blob], filename, {type: mimeType});
    }

    async getFile(filename: string) {
        try {
            const res = await super.get(`files/get?filename=${filename}`);
            return res;

        }
        catch (e) {
            console.log(e)
        }
    }
}
