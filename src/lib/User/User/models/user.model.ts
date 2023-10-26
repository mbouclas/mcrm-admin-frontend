import type {IGates, IRole} from "../../../Auth/auth.service";
import type {OrderModel} from "../../../Order/Order/models/order.model";
import type {ICustomerAddress} from "../../../Order/Order/models/order.model";
import {z} from "zod";


export const UserModelWithPasswordSchema = z.object({
    firstName: z.string({required_error: 'First name is required'}).min(4, 'Min 4 characters'),
    lastName: z.string({required_error: 'Last name is required'}).min(4, 'Min 4 characters'),
    email: z.string({required_error: 'Email is required'}).email(`Must be valid email`).min(4, 'Min 4 characters'),
    password: z.string({required_error: 'Password is required'}).min(4, 'Min 4 characters'),
    confirmPassword: z.string({required_error: 'Confirm password is required'}).min(4, 'Min 4 characters'),
});


export const BaseUserModelSchema = UserModelWithPasswordSchema.omit({
    password: true,
    confirmPassword: true,
});



export type IUserModelWithPassword = z.infer<typeof UserModelWithPasswordSchema>;
export type IUserModelWithPasswordSchema = z.infer<typeof UserModelWithPasswordSchema>;

export class UserModel {
    public active = false;
    public email: string;
    public firstName: string;
    public lastName: string;
    public password: string;
    public role: IRole[] = [];
    public levelRel: IRole;
    public uuid: string;
    public createdAt: Date;
    public updatedAt: Date;
    public address: ICustomerAddress[] = [];
    public maxLevel: number;
    public gates: IGates[] = [];
    public order: OrderModel[] = [];

    constructor(config?: Partial<UserModel>) {
        for (const key in config) {
            this[key] = config[key];
        }
    }
}
