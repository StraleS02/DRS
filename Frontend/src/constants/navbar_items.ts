import type { Role } from "./roles";

export interface SubmenuItem{
    title: string;
    path: string;
}

export interface NavbarItem {
    title: string;
    defaultPath: string;
    submenuItems: SubmenuItem[];
    roles: Role[];
}

export const navbarItems: NavbarItem[] = [
    {
        title: 'Profile',
        defaultPath: '/profile/edit',
        submenuItems: [
            {
                title: 'Edit',
                path: '/profile/edit'
            }
        ],
        roles: ['author', 'reader']
    },
    {
        title: 'Recipes',
        defaultPath: '/recipes/all',
        submenuItems: [
            {
                title: 'View All',
                path: '/recipes/all'
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
        defaultPath: '/users/all',
        submenuItems: [
            {
                title: 'View All',
                path: '/users/all'
            }
        ],
        roles: ['admin']
    }
]
export const getNavbarItemsByRole = (role: Role) => {
    return navbarItems.filter(item => item.roles.includes(role));
} 