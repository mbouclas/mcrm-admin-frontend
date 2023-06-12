import { writable } from "svelte/store";
import {AppService} from "./Shared/app.service";
import type {IGates} from "./Auth/auth.service";
import type {IBaseModel} from "./DynamicFields/base-model";
import type {IBootConfigs} from "../models/boot";

export interface IAppState {
    gates: IGates[];
    models: IBaseModel[];
    configs: IBootConfigs;
}

export interface INotification {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export const gridRowsStore = writable(null);
export const user = writable(null);
export const app = writable(null);
export const notificationsStore = writable<INotification>(null);


app.subscribe(res => {
    if (!res) {return;}
    AppService.updateAppState(res)
})


export function setNotificationAction(notification: INotification|null) {
    notificationsStore.set(notification);
}
