import { writable } from "svelte/store";
import {AppService} from "./Shared/app.service";
import type {IGates} from "./Auth/auth.service";
import type {IBaseModel} from "./DynamicFields/base-model";

export interface IAppState {
    gates: IGates[];
    models: IBaseModel[];
}

export const gridRowsStore = writable(null);
export const user = writable(null);
export const app = writable(null);
app.subscribe(res => {
    if (!res) {return;}
    AppService.updateAppState(res)
})
