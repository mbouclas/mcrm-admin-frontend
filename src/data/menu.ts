import {
    CogOutline,
    FolderDuplicateOutline,
    UserOutline,
    ArrowRightToBracketOutline,
    HomeOutline,
    ChartLineUpOutline, ShoppingBagOutline, UsersOutline, AtomSolid, AddressBookOutline, BuildingOutline,
} from "flowbite-svelte-icons";
import {Briefcase, Cog, Home, User} from "svelte-heros-v2";

export class SideBarMenuItem {
    public label: string;
    public icon: Function;
    public route: string;
    public children: SideBarMenuItem[] = [];
    public gate: string;
    public parent = null;  // Add parent reference
    public isActive = false;
    public href = null;
    public regexMatch: string = null;//use it to match the route with regex OR children like edit product, page etc

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
        label: 'Home',
        icon: HomeOutline,
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
                regexMatch: "^/catalogue/products/[^/]+$",
            }),
            new SideBarMenuItem({
                label: 'Categories',
                icon: null,
                route: '/catalogue/categories',
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
        icon: ShoppingBagOutline,
        route: '/orders/list',
        regexMatch: "^/orders/[^/]+$",
    }),
    new SideBarMenuItem({
        label: 'Customers',
        icon: UsersOutline,
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
                regexMatch: "^/cms/pages/[^/]+$",
            }),
            new SideBarMenuItem({
                label: 'Categories',
                icon: null,
                route: '/cms/categories',
            }),
        ]
    }),
    new SideBarMenuItem({
        label: 'CRM',
        icon: AddressBookOutline,
        children: [
            new SideBarMenuItem({
                label: 'Businesses',
                icon: BuildingOutline,
                route: '/crm/businesses/list',
                regexMatch: "^/crm/businesses/[^/]+$",
            }),
            new SideBarMenuItem({
                label: 'Categories',
                icon: FolderDuplicateOutline,
                route: '/crm/categories',
            }),
            new SideBarMenuItem({
                label: 'Accounts',
                icon: Briefcase,
                route: '/crm/accounts',
                regexMatch: "^/crm/accounts/[^/]+$",
            }),
            new SideBarMenuItem({
                label: 'People',
                icon: UserOutline,
                route: '/crm/people',
                regexMatch: "^/crm/people/[^/]+$",
            }),
            new SideBarMenuItem({
                label: 'Settings',
                icon: CogOutline,
                route: '/crm/settings',
            }),
        ],
    }),
    new SideBarMenuItem({
        label: 'Website',
        icon: AtomSolid,
        children: [
            new SideBarMenuItem({
                label: 'Menus',
                icon: null,
                route: '/menus',
                regexMatch: "^/menus/[^/]+$",
            }),
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
        label: 'Analytics',
        icon: ChartLineUpOutline,
        children: [
            new SideBarMenuItem({
                label: 'Orders',
                icon: null,
                route: '/analytics/orders',
            }),
            new SideBarMenuItem({
                label: 'Merchandising',
                icon: null,
                route: '/analytics/merchandising',
            }),
            new SideBarMenuItem({
                label: 'Predictive Analytics',
                icon: null,
                route: '/analytics/predictive',
            }),
        ]
    }),
    new SideBarMenuItem({
        label: 'Store',
        icon: CogOutline,
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
                label: 'Customer Groups',
                icon: null,
                route: '/settings/customer-groups',
            }),
            new SideBarMenuItem({
                label: 'Sales Channels',
                icon: null,
                route: '/settings/sales-channels',
            }),
        ]
    }),
    new SideBarMenuItem({
        label: 'Users',
        icon: UserOutline,
        children: [
            new SideBarMenuItem({
                label: 'Users',
                icon: User,
                route: '/users/list',
                regexMatch: "^/users/[^/]+$",
            }),
            new SideBarMenuItem({
                label: 'Roles',
                route: '/roles/list',
                regexMatch: "^/roles/[^/]+$",
            }),
            new SideBarMenuItem({
                label: 'Gates',
                route: '/gates/list',
                regexMatch: "^/gates/[^/]+$",
            }),

        ]
    }),
    new SideBarMenuItem({
        label: 'Logout',
        icon: ArrowRightToBracketOutline,
        href: '/logout',
    }),
]
