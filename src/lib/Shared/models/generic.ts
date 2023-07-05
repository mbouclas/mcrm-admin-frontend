export interface IGenericObject<T = any> {
  [key: string]: T;
}

export interface IEvent<T> extends Event {
  detail: T;
}
