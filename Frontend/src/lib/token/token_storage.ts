const itemName = "jwtToken";

export const setToken = (token: string):void => {
    localStorage.setItem(itemName, token);
}
export const getToken = ():string|null => {
    return localStorage.getItem(itemName);
}
export const clearToken = ():void => {
    localStorage.removeItem(itemName);
}