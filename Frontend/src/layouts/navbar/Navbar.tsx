import styles from './Navbar.module.css';
import type { NavbarItem } from '../../lib/constants/navbar_items';
import { Link, useLocation } from 'react-router-dom';

type NavbarProps = {
    items: NavbarItem[];
};

const Navbar = ({items}:NavbarProps) => {
    
    const location = useLocation();
    const pathRoot = '/' + location.pathname.split('/')[1];
    
    return (
        <div className={styles.navbar}>
            {items.map(item => (
                <Link key={item.title} className={`${styles.item} ${pathRoot === item.defaultPath ? styles.active : ""}`} to={item.defaultPath}>
                    <div className={styles.item_title}>{item.title}</div>
                    <div className={styles.item_marker}></div>
                </Link>
            ))}
        </div>
    );
}
export default Navbar;