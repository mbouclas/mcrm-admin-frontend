export interface IGenericObject<T = any> {
  [key: string]: T;
}

export interface IEvent<T> extends Event {
  detail: T;
}

export interface IPagination<T> {
  total:number;
  limit:number; // num of items to display
  skip?: number; // offset
  page?: number;
  pages?: number;
  data:T[];
}

export interface IMcrmDi {
  id: string;
  title?: string;
  description?: string;
  reference?: any;
  usedFor?: string;
  model?: string;
  category?: string;
}
