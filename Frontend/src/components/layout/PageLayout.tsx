import Navbar from '../navbar/Navbar';
import styles from './Layout.module.css';

type PageLayoutProps = {
    header: React.ReactNode;
    content: React.ReactNode;
};

const PageLayout = ({header, content}:PageLayoutProps) => {
    return (
        <div className={styles.page_layout}>
            <div className={styles.section_header}>
                {header}
            </div>
            <div className={styles.section_content}>
                {content}
            </div>
        </div>
    );
}
export default PageLayout;