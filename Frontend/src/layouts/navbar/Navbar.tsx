import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import type { NavbarItem } from '../../lib/constants/navbar_items';
import { useAuth } from '../../app/AuthContext';

type NavbarProps = {
    items: NavbarItem[]
};

const Navbar = ({items}:NavbarProps) => {
    const {user, token, handleLogout} = useAuth();
    const navigate = useNavigate();

    const handleLogoutButtonClicked = () => {
        if(token) {
            handleLogout();
        }else{
            navigate("/");
        }
    }
    
    return (
        <div className={styles.navbar}>
            <div className={styles.section_items}>
                {items.map((item, index) => (
                    <div key={item.title} className={styles.item}>
                        <a href={item.defaultPath}>{item.title}</a>
                        <div className={styles.submenu}>
                            {item.submenuItems.map(submenuItem => (
                                <div key={submenuItem.title} className={styles.item}>
                                    <a href={submenuItem.path}>{submenuItem.title}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.section_info}>
                <div className={styles.info_role}>
                    <span>{user?.role}</span>
                </div>
                <div className={styles.info_email}>
                    <span>{user?.email}</span>
                </div>
                <div className={styles.info_logout}>
                    <button onClick={handleLogoutButtonClicked}>Logout</button>
                </div>
            </div>
        </div>
    );
}
export default Navbar;