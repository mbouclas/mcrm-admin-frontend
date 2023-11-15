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
  metaData?: IGenericObject;
}

export interface NestedSortableObject {
    order: number;
    label: string;
    children: NestedSortableObject[];
}

export enum TreeDeleteType {
  DELETE_CHILDREN = 'DELETE_CHILDREN',
  MOVE_CHILDREN_TO_PARENT = 'MOVE_CHILDREN_TO_PARENT',
  MOVE_CHILDREN_TO_ROOT = 'MOVE_CHILDREN_TO_ROOT',
}
