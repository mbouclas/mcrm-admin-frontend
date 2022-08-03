import { BaseHttpService } from "../Shared/base-http.service";


export class AuthService extends BaseHttpService {
    async login(username: string, password: string) {
        const headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("Authorization", "Basic YWRtaW5BcHA6dG9wU2VjcmV0");

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);
        urlencoded.append("grant_type", "password");

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: urlencoded,

        };

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}oauth/token`, requestOptions);
        // const text = await res.text();
        // console.log(await res.json())
       return await res.json();
    }
}
