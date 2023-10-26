import {z} from "zod";

export const addressSchema = z.object({
    firstName: z.string({required_error: 'First name is required.'}).min(3, 'First name must be at least 3 character long.'),
    lastName: z.string({required_error: 'Last name is required.'}).min(3, 'Last name must be at least 3 character long.'),
    street: z.string({required_error: 'Street is required.'}).min(3, 'Street must be at least 3 character long.'),
    city: z.string({required_error: 'City is required.'}).min(3, 'City must be at least 3 character long.'),
    company: z.string({required_error: 'Company is required.'}).min(3, 'Company must be at least 3 character long.'),
    country: z.string({required_error: 'Country is required.'}),
    region: z.string({required_error: 'Region is required.'}).min(3, 'Region must be at least 3 character long.'),
    postCode: z.string({required_error: 'Post code is required.'}).min(3, 'Post code must be at least 3 character long.'),
    phone: z.string({required_error: 'Phone is required.'}).min(3, 'Phone must be at least 3 character long.'),
    apartment: z.string().optional(),
});

export type AddressModel = z.infer<typeof addressSchema>;
