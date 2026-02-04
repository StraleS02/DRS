import styles from './AuthViews.module.css';
import { useState } from 'react';
import AuthForm from '../components/auth_form/AuthForm';
import FormRow from '../../../components/form_elements/form_row/FormRow';
import TextInput from '../../../components/form_elements/text_input/TextInput';
import SubmitButton from '../../../components/form_elements/submit_button/SubmitButton';
import LoadingView from '../../../components/loading/LoadingView';
import { useAuth } from '../useAuth';
import type { FailedLoginResponse, LoginRequest, SuccessfulLoginResponse } from '../auth.types';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth.api';

const LoginView = () => {

    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    
    const [errorTrigger, setErrorTrigger] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [waiting, setWaiting] = useState<boolean>(false);

    const {loading, user, handleLogin} = useAuth();
    const navigate = useNavigate();

    if(loading || waiting) return <LoadingView></LoadingView>

    const handleErrorDetected = () => {
        setErrorTrigger(t => (t+1)%100);
    }

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaiting(true);
        
        const emailErr = email.trim() === "";
        const passwordErr = password.trim() === "";
        
        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if(emailErr || passwordErr)  {
            handleErrorDetected();
            const emailMessage = emailErr ? "Email needs to be in a valid form and is required. " : "";
            const passwordMessage = passwordErr ? "Password is required." : "";
            setFeedback(emailMessage + passwordMessage);
            setWaiting(false);
            return;
        }
        
        const loginRequest:LoginRequest = {email, password};

        try {
            const response:SuccessfulLoginResponse = await login(loginRequest);
            handleLogin(response.token);
        } catch (error: any) {
            if(!error.response) {
                setFeedback("No connection to the server.");
            } else {
                const status = error.response.status;
                const data = error.response.data as FailedLoginResponse;

                switch(status) {
                    case 403:
                        const minutes = Math.ceil(data.blocked_seconds / 60);
                        setFeedback(`Too many attempts, try again in about ${minutes} ${minutes > 1 ? "minutes." : "minute."}`);
                        break;
                    case 401:
                        setFeedback(data.message);
                        break;
                    default:
                        setFeedback(data.message);
                }
            }
            
        } finally {
            setWaiting(false);
        }
        
    }

    return(
        <div className={styles.login_view}>
            <AuthForm title='Login' feedback={feedback} onSubmit={onSubmit} swapPath='/register' swapTitle='You can Register here'>
                {(
                    <>
                        <FormRow>
                            <TextInput key={errorTrigger} type='email' value={email} error={emailError} placeholder='Email' onChange={(value) => setEmail(value)}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} type='password' value={password} error={passwordError} placeholder='Password' onChange={(value) => setPassword(value)}></TextInput>
                        </FormRow>
                        <FormRow>
                            <SubmitButton title='Login'></SubmitButton>
                        </FormRow>
                    </>
                )}
            </AuthForm>
        </div>
    );
}
export default LoginView;