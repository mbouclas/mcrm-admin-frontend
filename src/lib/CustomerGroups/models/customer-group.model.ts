export class CustomerGroupModel {
    uuid: string;
    title: string;
    description: string;
    active = false;
    default = false;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(config?: Partial<CustomerGroupModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}
