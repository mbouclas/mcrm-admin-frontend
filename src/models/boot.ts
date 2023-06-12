export interface IBootConfigs {
    [key: string]: any;
    catalogue: Catalogue;
    images: Images;
    mail: Mail;
    store: Store;
}


export interface Images {
    copies?: any[] | null;
    provider: string;
    cloudinary: Cloudinary;
    import: Import;
}
export interface Items {
    images: Images;
    files: any;
}
export interface Catalogue {
    items: Items;
    categories?: any[] | null;
    import: Import;
}
export interface Import {
    overwriteImages: boolean;
    templates?: Templates[] | null;
}
export interface Templates {
    id: string;
    type: string;
    name: string;
    default: boolean;
    fieldMap?: (FieldMap)[] | null;
}
export interface FieldMap {
    importFieldName: string;
    name: string;
    required: boolean;
    type: string;
    isSlugFor: string;
    priceOnRequestFlag: string;
    matchSourceValue: string;
    matchTargetValue: string;
    slugifyValue: boolean;
}
export interface RootObject {
    catalogue: Catalogue;
    images: Images;
    mail: Mail;
    store: Store;
}
export interface Cloudinary {
    use_filename: boolean;
    unique_filename: boolean;
    overwrite: boolean;
    folder: string;
}
export interface Mail {
    address: string;
    from: string;
    provider: string;
    mailgun: Mailgun;
}
export interface Mailgun {
    domain: string;
    secret: string;
}
export interface Store {
    VAT: number;
    quickCheckout: boolean;
    guestCheckout: boolean;
    orderStatuses?: (OrderStatuses)[] | null;
    users: Users;
    notifications: Notifications;
}
export interface OrderStatuses {
    id: number;
    label: string;
}
export interface Users {
    registerGuests: boolean;
}
export interface From {
    mail: string;
    name: string;
}
export interface Email {
    from: From;
    adminEmail: AdminEmail;
    order: Order;
}
export interface AdminEmail {
    mail: string;
    name: string;
}
export interface Created {
    subject: string;
    template: string;
}
export interface Admin {
    created: Created;
    updated: Updated;
    cancelled: Cancelled;
}
export interface Updated {
    subject: string;
    template: string;
}
export interface Cancelled {
    subject: string;
    template: string;
}
export interface Order {
    admin: Admin;
    customer: Customer;
}
export interface Customer {
    created: Created;
    updated: Updated;
    cancelled: Cancelled;
}
export interface Notifications {
    email: Email;
}
