import type { Role } from "./Roles";

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

export const NavbarItems: NavbarItem[] = [
    {
        title: 'Profile',
        defaultPath: '/profile/edit',
        submenuItems: [
            {
                title: 'Edit',
                path: '/profile/edit'
            },
            {
                title: 'Upgrade',
                path: '/profile/upgrade'
            }
        ],
        roles: ['author', 'visitor']
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
        roles: ['author', 'visitor']
    }
]