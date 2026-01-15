import PageLayout from "../../components/layout/PageLayout";
import Navbar from "../../components/navbar/Navbar";
import styles from "./ProfilePages.module.css";

const EditProfilePage = () => {
    return (
        <PageLayout header={<Navbar></Navbar>} content={(
            <div className={styles.users_page}>
                
            </div>
        )}></PageLayout>
    );
}
export default EditProfilePage;