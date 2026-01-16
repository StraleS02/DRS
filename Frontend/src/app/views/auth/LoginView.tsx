import { useNavigate } from 'react-router-dom';
import styles from './AuthViews.module.css';
import { useEffect, useRef, useState } from 'react';
import type { LoginRequest, LoginResponse } from '../../../features/auth/auth.types';
import { authenticate, login } from '../../../features/auth/auth.api';
import { useAuth } from '../../AuthContext';

const LoginPage = () => {
    const {token, user, loading, handleLogin} = useAuth();
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [feedback, setFeedback] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if(!loading && user && token) {
            if(user.role === 'admin'){
                navigate("/users/", {replace: true});
            }else{
                navigate("/recipes/", {replace: true});
            }
        }
    }, [user, loading, navigate]);

    if(loading) return <div>Loading...</div>;

    const handleSubmitClicked = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        let loginRequest: LoginRequest = {
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || ""
        };

        try {
            const data:LoginResponse = await login(loginRequest);
            if(data.token && data.user && authenticate(data.token, data.user)) {
                handleLogin(data.token, data.user);
            }else{
                setFeedback("Invalid Credentials");
            }
        } catch (error) {
            setFeedback("Invalid Credentials.");
        }
    }

    return(
        <div className={styles.root}>
            <div className={styles.main_section}>
                <div className={styles.title}>Login</div>
                <form onSubmit={handleSubmitClicked}>
                    <div>
                        <input type='email' placeholder='Email' required ref={emailRef}></input>
                    </div>
                    <div>
                        <input type='password' placeholder='Password' required ref={passwordRef}></input>
                    </div>
                    <div>
                        <input type='submit' value="Login"></input>
                    </div>  
                </form>
                <div className={styles.info}>
                    <span>{feedback}</span>
                </div>
            </div>
            <div className={styles.switch_section}>
                <a href='/auth/register' className={styles.switch_link}>Register&nbsp;&nbsp;&gt;</a>
            </div>
        </div>
    );
}
export default LoginPage;