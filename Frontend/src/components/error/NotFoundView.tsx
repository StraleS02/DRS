import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFoundView = () => {
    return (
        <div className={styles.not_found_view}>
            <h1 className={styles.title}>Error 404: Page not Found</h1>
            <Link className={styles.home_link} to="/">Home</Link>
        </div>
    );
}
export default NotFoundView;