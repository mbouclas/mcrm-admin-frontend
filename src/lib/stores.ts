import { writable } from "svelte/store";
import { AppService } from "./Shared/app.service";
import type { IGates } from "./Auth/auth.service";
import type { IBaseModel } from "./DynamicFields/base-model";

export interface IAppState {
  gates: IGates[];
  models: IBaseModel[];
}

export interface INotification {
  message: string;
  type: "success" | "error" | "warning" | "info";
  expiration?: number;
}

export const gridRowsStore = writable(null);
export const user = writable(null);
export const app = writable(null);
export const notificationsStore = writable<INotification[]>([]);

app.subscribe((res) => {
  if (!res) {
    return;
  }
  AppService.updateAppState(res);
});

export function setNotificationAction(notification: INotification | null) {
  notificationsStore.update((arr) => {
    const newArr = [
      { ...notification, expiration: notification.expiration || 3000 },
      ...arr,
    ];
    return newArr;
  });
}
