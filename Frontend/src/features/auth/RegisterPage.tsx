import styles from './AuthPages.module.css';

const RegisterPage = () => {
    return(
        <div className={styles.root}>
            <div className={styles.main_section}>
                <div className={styles.title}>Register</div>
                <form>
                    <div>
                        <input type='email' placeholder='Email'></input>
                    </div>
                    <div>
                        <input type='password' placeholder='Password'></input>
                    </div>
                    <div>
                        <input type='text' placeholder='Name'></input>
                    </div>
                    <div>
                        <input type='text' placeholder='Last Name'></input>
                    </div>
                    <div className={styles.field}>       
                        <div className={styles.field_birthdate}>
                            <input type='date' placeholder='Birth date'></input>
                        </div>
                        <div className={styles.field_gender}>
                            <label>Male
                                <input type='radio' name="gender"></input>
                            </label>
                            <label>Female
                                <input type='radio' name="gender"></input>
                            </label>
                        </div>
                    </div> 
                    <div>
                        <input type='text' placeholder='Country Name'></input>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.field_street}>
                            <input type='text' placeholder='Street Name'></input>
                        </div>
                        <div className={styles.field_number}>
                            <input type='number' placeholder='Number'></input>
                        </div>
                    </div>
                    <div>
                        <input type='button' value="Register"></input>
                    </div>
                </form>
                <div className={styles.info}></div>
            </div>
            <div className={styles.switch_section}>
                <a className={styles.switch_link}>Login&nbsp;&nbsp;&gt;</a>
            </div>
        </div>
    );
}
export default RegisterPage;