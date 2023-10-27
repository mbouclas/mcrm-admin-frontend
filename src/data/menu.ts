import {Dash, Exit} from "radix-icons-svelte";
import {ChartPieSolid, FolderDuplicateOutline} from "flowbite-svelte-icons";
import {Cog, Home} from "svelte-heros-v2";

export class SideBarMenuItem {
    public label: string;
    public icon: Function;
    public route: string;
    public children: SideBarMenuItem[] = [];
    public gate: string;
    public parent = null;  // Add parent reference
    public isActive = false;
    public href = null;

    constructor(config: Partial<SideBarMenuItem>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }

        // Set the parent for each child
        this.children.forEach(child => {
            child.parent = this;
        });
    }
}

export const sideBarMenuItems: SideBarMenuItem[] = [
    new SideBarMenuItem({
        label: 'Dashboard',
        icon: Home,
        route: '/',
    }),
    new SideBarMenuItem({
        label: 'Catalogue',
        icon: FolderDuplicateOutline,
        route: '/catalogue',
        children: [
            new SideBarMenuItem({
                label: 'Products',
                icon: null,
                route: '/catalogue/products/list',
            }),
            new SideBarMenuItem({
                label: 'Categories',
                icon: null,
                route: '/catalogue/products/categories',
            }),
            new SideBarMenuItem({
                label: 'Properties',
                icon: null,
                route: '/catalogue/properties/list',
            }),
            new SideBarMenuItem({
                label: 'Manufacturers',
                icon: null,
                route: '/catalogue/manufacturers/list',
            }),
            new SideBarMenuItem({
                label: 'Import',
                icon: null,
                route: '/catalogue/products/import',
            }),
        ]
    }),
    new SideBarMenuItem({
        label: 'Orders',
        icon: null,
        route: '/orders/list',
    }),
    new SideBarMenuItem({
        label: 'Customers',
        icon: null,
        route: '/customers/list',
    }),
    new SideBarMenuItem({
        label: 'CMS',
        icon: FolderDuplicateOutline,
        children: [
            new SideBarMenuItem({
                label: 'Pages',
                icon: null,
                route: '/cms/pages/list',
            }),
            new SideBarMenuItem({
                label: 'Categories',
                icon: null,
                route: '/cms/categories',
            }),
        ]
    }),
    new SideBarMenuItem({
        label: 'Website',
        icon: null,
        children: [
            new SideBarMenuItem({
                label: 'Editable Regions',
                icon: null,
                route: '/editable-regions',
            }),
            new SideBarMenuItem({
                label: 'Storefronts',
                icon: null,
                route: '/website/store-fronts',
            }),
            new SideBarMenuItem({
                label: 'Settings',
                icon: Cog,
                route: '/website/settings',
            }),
        ]
    }),
    new SideBarMenuItem({
        label: 'Store Settings',
        icon: null,
        children: [
            new SideBarMenuItem({
                label: 'Custom Fields',
                icon: null,
                route: '/settings/cf',
            }),
            new SideBarMenuItem({
                label: 'Payment Methods',
                icon: null,
                route: '/settings/payment-methods',
            }),
            new SideBarMenuItem({
                label: 'Shipping Methods',
                icon: null,
                route: '/settings/shipping',
            }),
            new SideBarMenuItem({
                label: 'Conditions',
                icon: null,
                route: '/settings/conditions/list',
            }),
            new SideBarMenuItem({
                label: 'Sales Channels',
                icon: null,
                route: '/settings/sales-channels',
            }),
        ]
    }),
    new SideBarMenuItem({
        label: 'Logout',
        icon: Exit,
        href: '/logout',
    }),
]
