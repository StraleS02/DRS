export type JwtPayload = {
    userId: number;
    email: string;
    role: string;
    favorite_recipe_ids: number[]
    exp: number;
};

export const decodeJwt = (token: string) => {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
}