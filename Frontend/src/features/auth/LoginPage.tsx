import styles from './AuthPages.module.css';

const LoginPage = () => {
    return(
        <div className={styles.root}>
            <div className={styles.main_section}>
                <div className={styles.title}>Login</div>
                <form>
                    <div>
                        <input type='email' placeholder='Email'></input>
                    </div>
                    <div>
                        <input type='password' placeholder='Password'></input>
                    </div>
                    <div>
                        <input type='button' value="Login"></input>
                    </div>  
                </form>
                <div className={styles.info}>
                    <span></span>
                </div>
            </div>
            <div className={styles.switch_section}>
                <a className={styles.switch_link}>Register&nbsp;&nbsp;&gt;</a>
            </div>
        </div>
    );
}
export default LoginPage;