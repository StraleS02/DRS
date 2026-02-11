import styles from "./AdminViews.module.css";

const UserReportView = () => {
    
    return (
        <div className={styles.user_report_view}>
            <h1 className={styles.pdf_title}> You can generate a pdf document for:</h1>
            <ul className={styles.pdf_title}>
                <li>Total number of registered users</li>
                <li>Total number of recipes in the system</li>
                <li>Top 5 authors ranked by their average recipe rating</li>
            </ul>
            <button className={styles.pdf_generate}>Generate and download Report</button>
        </div>
    );
}
export default UserReportView;