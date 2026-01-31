export type JwtPayload = {
    userId: number;
    email: string;
    role: string;
    exp: number;
};

export const decodeJwt = (token: string) => {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
}