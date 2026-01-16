import PageLayout from "../../layouts/view/PageLayout";
import Navbar from "../../layouts/navbar/Navbar";
import { getNavbarItemsByRole } from "../../lib/constants/navbar_items";
import styles from "./ProfilePages.module.css";

const EditProfilePage = () => {
    return (
        <PageLayout header={<Navbar items={getNavbarItemsByRole('admin')}></Navbar>} content={(
            <div className={styles.users_page}>
                
            </div>
        )}></PageLayout>
    );
}
export default EditProfilePage;