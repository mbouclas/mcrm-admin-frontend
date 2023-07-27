import { writable } from 'svelte/store';
import { AppService } from './Shared/app.service';
import type { IGates } from './Auth/auth.service';
import type { IBaseModel } from './DynamicFields/base-model';
import type { IBootConfigs } from '../models/boot';

export interface IAppState {
  gates: IGates[];
  models: IBaseModel[];
  configs: IBootConfigs;
}

export interface INotification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  expiration?: number;
}

export interface IFilters {
  total?: number;
  status?: string;
  date?: string;
}

export const gridRowsStore = writable(null);
export const user = writable(null);
export const app = writable<IAppState>(null);
export const notificationsStore = writable<INotification[]>([]);

app.subscribe((res) => {
  if (!res) {
    return;
  }
  AppService.updateAppState(res);
});

export function setNotificationAction(notification: INotification | null) {
  notificationsStore.update((arr) => {
    const newArr = [{ ...notification, expiration: notification.expiration || 3000 }, ...arr];
    return newArr;
  });
}
