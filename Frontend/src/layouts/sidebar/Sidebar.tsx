import { Link, useLocation } from "react-router-dom";
import type { NavbarItem, SubmenuItem } from "../../lib/constants/navbar_items";
import styles from "./Sidebar.module.css";

type SidebarProps = {
    navbarItems: NavbarItem[];
};

const Sidebar = ({navbarItems}:SidebarProps) => {

    const location = useLocation();
    
    const pathRoot = '/' + location.pathname.split('/')[1];
    const currentNavbarItem:NavbarItem|undefined = navbarItems.find(item => item.defaultPath === pathRoot);

    return (
        <div className={styles.sidebar}>
            {currentNavbarItem && currentNavbarItem.submenuItems.map(item => (
                <Link key={item.title} style={{all: "unset"}} to={item.path}>
                    <div className={`${styles.item} ${item.path === location.pathname ? styles.active : ""}`}>
                        <div className={styles.item_marker}></div>
                        <div className={styles.item_title}>{item.title}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
export default Sidebar;