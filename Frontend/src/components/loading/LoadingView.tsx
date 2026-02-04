import Loading from "./Loading";
import styles from "./Loading.module.css";

const LoadingView = () => {
    
    return (
        <div className={styles.loading_view}>
            <Loading size="large" theme="dark"></Loading>
        </div>
    );
}
export default LoadingView;