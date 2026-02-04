import type { Role } from "./roles";

export interface SubmenuItem{
    title: string;
    path: string;
}

export interface NavbarItem {
    title: string;
    defaultPath: string;
    submenuItems: SubmenuItem[];
    roles: string[];
}

export const navbarItems: NavbarItem[] = [
    {
        title: 'Profile',
        defaultPath: '/profile',
        submenuItems: [
            {
                title: 'Edit',
                path: '/profile'
            }
        ],
        roles: ['author', 'reader']
    },
    {
        title: 'Recipes',
        defaultPath: '/recipes',
        submenuItems: [
            {
                title: 'View All',
                path: '/recipes'
            },
            {
                title: 'Create',
                path: '/recipes/create'
            }
        ],
        roles: ['author', 'reader']
    },
    {
        title: 'Users',
        defaultPath: '/users',
        submenuItems: [
            {
                title: 'View All',
                path: '/users'
            }
        ],
        roles: ['admin']
    }
]
export const getNavbarItemsByRole = (role: string) => {
    return navbarItems.filter(item => item.roles.includes(role));
} 