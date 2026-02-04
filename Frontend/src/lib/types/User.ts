export interface User{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_of_birth: string;
    gender: string;
    country: string;
    street: string;
    street_number: number;
    profile_image: string;
    created_at: string;
    favorites: number[];
}