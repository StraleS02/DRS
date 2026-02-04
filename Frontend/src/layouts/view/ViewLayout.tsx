import { Outlet } from "react-router-dom";
import styles from "./ViewLayout.module.css";

type ViewLayoutProps = {
    navbar?: React.ReactNode;
    leftWidget?: React.ReactNode;
    rightWidget?: React.ReactNode;
    sidebar?: React.ReactNode;
    footer?: React.ReactNode;
};

const ViewLayout = ({navbar, leftWidget, rightWidget, sidebar, footer}:ViewLayoutProps) => {
    return (
        <div className={styles.view_layout}>
            <div className={styles.header_section}>
                <div className={styles.left_section}>{leftWidget}</div>
                <div className={styles.central_section}>{navbar}</div>
                <div className={styles.right_section}>{rightWidget}</div>
            </div>
            <div className={styles.content_section}>
                <div className={styles.left_section}>{sidebar}</div>
                <div className={styles.central_section}>
                    <Outlet></Outlet>
                </div>
                <div className={styles.right_section}></div>
            </div>
            {footer && (
                <div className={styles.footer_section}>
                    <div className={styles.left_section}></div>
                    <div className={styles.central_section}>{footer}</div>
                    <div className={styles.right_section}></div>
                </div>
            )}
            
        </div>
    );
}
export default ViewLayout;