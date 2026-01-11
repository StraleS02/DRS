import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.section_items}>
                <div className={styles.item}>
                    <a onClick={() => {console.log("test")}}>Home</a>
                </div>
                <div className={styles.item}>
                    <a>Profile</a>
                    <div className={styles.submenu}>
                        <div className={styles.item}>
                            <a>First</a>
                        </div>
                        <div className={styles.item}>
                            <a>Second</a>
                        </div>
                    </div>
                </div>
                <div className={styles.item}>
                    <a>Recipes</a>
                </div>
            </div>
            <div className={styles.section_info}>
                <div className={styles.info_role}>
                    <span>Admin</span>
                </div>
                <div className={styles.info_email}>
                    <span>srbinogi012@gmail.com</span>
                </div>
                <div className={styles.info_logout}>
                    <button>Logout</button>
                </div>
            </div>
        </div>
    );
}
export default Navbar;