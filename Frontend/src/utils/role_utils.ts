export const getRoleColor = (role:string):string => {
    switch(role) {
        case "reader":
            return "#007047";
        case "author":
            return "#0036ab";
        case "admin":
            return "#b30900";
        default: 
            return "black";
    }
}