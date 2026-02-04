import { useState } from "react";
import Loading from "../../../../components/loading/Loading";
import { useAuth } from "../../useAuth";
import styles from "./AuthWidget.module.css";
import { getRoleColor } from "../../../../utils/role_utils";

const AuthWidget = () => {

    const {user, loading, handleLogout} = useAuth();

    if(loading) return <Loading size="small" theme="dark"></Loading>

    const [hovered, setHovered] = useState<boolean>(false);

    const getUsername = () => {
        if(!user) return "";
        const username = user.email.split("@")[0];
        return username;
    }
    
    return (
        <div className={styles.auth_widget} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className={styles.header}>
                <div className={styles.email}>
                    {hovered ? user?.email : getUsername()}
                </div>
                <div className={styles.menu_icon}>
                    <img src="/menu_icon.png"></img>
                </div>
            </div>
            
            <div className={styles.menu}>
                <div className={styles.buffer}></div>
                {user && (<div className={`${styles.menu_item} ${styles.role}`} style={{color: getRoleColor(user.role)}}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>)}
                <div className={`${styles.menu_item} ${styles.logout}`} onClick={handleLogout}>Logout</div>
            </div>
        </div>
    );
}
export default AuthWidget;